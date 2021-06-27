import { getCustomRepository } from "typeorm"
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { UserRepositories } from "../repositories/UserRepositories"

interface IAuthenticateRequest {
  email: string;
  password: string;

}


class AuthenticateUserService {
  async execute({ email, password }: IAuthenticateRequest) {
    const userRepositories = getCustomRepository(UserRepositories);

    //Verificar se o email existe 
    const user = await userRepositories.findOne({
      email
    });

    if (!user) {
      throw new Error("Email/Password incorret!")
    }
    //Verificar se a senha está correta
    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) {
      throw new Error("Email/Password incorret!")
    }

    //Gerar o token
    const token = sign({
      email: user.email
    }, "2c3ae9fe45ec21c4247fd98970896b75", {
      subject: user.id,
      expiresIn: "1d"
    });

    return token;
  }
}

export { AuthenticateUserService }