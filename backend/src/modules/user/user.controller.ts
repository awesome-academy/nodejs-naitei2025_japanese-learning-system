import {
  Body,
  Controller,
  Patch,
  Post,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-reponse.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/entities/users.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import sharp from 'sharp';

@Controller('user/')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ user: UserResponseDto | null }> {
    const user = await this.userService.createUser(createUserDto);
    return this.userService.buildUserResponse(user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateProfile(
    @Body() dataUser: UpdateUserDto,
    @Request() request: any,
  ): Promise<{ user: UserResponseDto | null }> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const userId = request.user.userId;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const token = request.headers.authorization?.split(' ')[1];
    const user = await this.userService.updateProfile(
      userId as number,
      dataUser,
    );
    return this.userService.buildUserResponse(user as User, token as string);
  }

  @UseGuards(JwtAuthGuard)
  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return cb(
            new BadRequestException('Only JPG/PNG files are allowed'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const userId = req.user.userId;

    // Xử lý ảnh (resize + convert sang PNG) bằng Sharp
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const buffer: Buffer = await sharp(file.buffer)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      .resize(300, 300)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      .png({ quality: 80 })
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      .toBuffer();

    // Chuyển buffer sang Base64
    const base64Image = `data:image/png;base64,${buffer.toString('base64')}`;

    // Lưu Base64 vào DB
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const updatedUser = await this.userService.updateProfile(userId, {
      image: base64Image,
    });

    return {
      user: {
        email: updatedUser?.email,
        full_name: updatedUser?.full_name,
        image: updatedUser?.image, // trả về Base64 trực tiếp
      },
    };
  }
}
