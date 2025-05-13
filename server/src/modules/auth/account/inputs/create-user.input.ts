import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

@InputType()
export class CreateUserInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/)
  public username: string;

  @Field(() => String)
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @Field(() => String)
  @IsNotEmpty()
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/,
    { message: 'Password too weak: must include upper, lower, number, and symbol' }
  )
  public password: string;
}
