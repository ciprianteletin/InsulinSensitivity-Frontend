export class DetailedUserModel {
  id: number;
  username: string;
  role: string;
  details: {
    email: string;
    firstName: string;
    lastName: string;
    phoneNr: string;
    birthDay: string;
    joinDate: string;
    gender: string;
    lastLoginDate: string;
    profileImageUrl?: string;
  };
}
