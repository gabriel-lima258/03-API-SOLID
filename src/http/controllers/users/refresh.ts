/* eslint-disable prettier/prettier */
import { FastifyRequest, FastifyReply } from "fastify";

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  // funcao para validar o token dentro dos cookies
  await request.jwtVerify({ onlyCookie: true });

  // caso exista, prossiga verificando a role de user
  const { role } = request.user;

  // criando um token de autenticacao
  // Primeiro parametro => payload
  // Segundo parametro => sign com id do user
  const token = await reply.jwtSign(
    { role }, // passando role para o payload
    {
      sign: {
        sub: request.user.sub,
      },
    }
  );

  // refresh token sera o 2 token com expiracao maior
  const refreshToken = await reply.jwtSign(
    { role },
    {
      sign: {
        sub: request.user.sub,
        expiresIn: "7d", // 7 days
      },
    }
  );

  // enviando o segundo token dentro do cookie,
  // esse segundo token nao e visivel caso de hackers
  return reply
    .setCookie("refreshToken", refreshToken, {
      path: "/", // todas rotas tem acesso
      secure: true, // HTTPs
      sameSite: true, // acessivel ao msm dominio
      httpOnly: true, // acessivel somente ao backend
    })
    .status(200)
    .send({
      token,
    });
}
