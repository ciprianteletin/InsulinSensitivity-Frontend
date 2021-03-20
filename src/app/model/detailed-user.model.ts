export class DetailedUserModel {
  username: string;
  role: string;
  details: {
    email: string;
    firstName: string;
    lastName: string;
    phoneNr: string;
    age: number;
    joinDate: string;
    lastLoginDate: string;
    profileImageUrl?: string;
  };
}
