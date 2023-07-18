export function mapErrorCodeToMessage(authCode: string) {
  switch (authCode) {
    case 'auth/wrong-password':
      return 'Incorrect email or password';
    case 'auth/invalid-email':
      return 'Incorrect email or password';
    case 'auth/too-many-requests':
      return 'This user has made too many requests. Please wait a moment or try logging in with another account.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists';
    case 'auth/user-not-found':
      return 'Incorrect email or password';
    case 'auth/weak-password':
      return 'Your password is too weak. Please choose a stronger password';
    // case 'auth/user-not-found':
    //   return 'Error while searching for the user';
    // case 'auth/user-disabled':
    //   return 'User account is disabled';
    default:
      return 'Sorry, an unexpected error occurred';
  }
}
