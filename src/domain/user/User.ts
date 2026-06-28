import { Entity, EntityProps } from '@domain/shared/Entity';

export interface PartialUserProps {
  email: string;
  password: string;
}

type UserProps = PartialUserProps & EntityProps;

export class User extends Entity {
  readonly email: string;
  readonly password: string;

  constructor(props: UserProps) {
    super({
      id: props.id,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });
    this.email = props.email;
    this.password = props.password;
  }
}
