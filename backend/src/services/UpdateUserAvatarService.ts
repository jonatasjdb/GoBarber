import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';
import User from '../model/Users';
import uploadConfig from '../config/upload';

interface Request {
  user_id: string;
  avatar_fileName: string;
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatar_fileName }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne(user_id);

    if (!user) {
      throw new Error('Only authenticated users can change avatar');
    }

    if (user.avatar) {
      // Deletar avatar anterior
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }
    user.avatar = avatar_fileName;

    await usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
