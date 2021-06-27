import { getCustomRepository } from "typeorm";
import { UserRepositories } from "../repositories/UserRepositories"
import { hash } from "bcryptjs";

interface IUserRequest {
  name: string;
  email: string;
  admin?: boolean;
  password: string;
}

class CreateUserService {
  async execute({ name, email, admin = false, password }: IUserRequest) {
    const UserRepository = getCustomRepository(UserRepositories);

    //Verifica se o email esta preenchido
    if (!email) {
      throw new Error("Email incorrect.");
    }

    //Faz uma busca por email para ver se ele existe no BD 
    const userAlreadyExists = await UserRepository.findOne({
      email
    });

    //Se existir retorna um erro
    if (userAlreadyExists) {
      throw new Error("User already exists.");
    }

    const passwordHash = await hash(password, 8);

    //Se não existir, guarda as variaveis e salva no BD
    const user = UserRepository.create({
      name,
      email,
      admin,
      password: passwordHash,
    });

    await UserRepository.save(user);

    return user;
  }
}

export { CreateUserService }
