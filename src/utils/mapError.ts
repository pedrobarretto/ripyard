export function mapErrorCodeToMessage(authCode: string) {
  switch (authCode) {
    case 'auth/wrong-password':
      return 'Email ou senha incorretos';
    case 'auth/invalid-email':
      return 'Email ou senha incorretos';
    case 'auth/too-many-requests':
      return 'Esse usuário fez muitas requisições, aguarde um pouco ou tente entrar com outra conta'
    case 'auth/email-already-in-use':
      return 'Já existe uma conta com esse email';
    case 'auth/user-not-found':
      return 'Email ou senha inválidos';
    case 'auth/weak-password':
      return 'Sua senha é muito fraca, tente cadastrar uma senha mais forte';
    // case 'auth/user-not-found':
    //   return 'Erro ao buscar pelo usuário';
    // case 'auth/user-disabled':
    //   return 'Usuário teve sua conta desabilitada';
    default:
      return 'Desculpe, ocorreu um erro inesperado';
  }
}