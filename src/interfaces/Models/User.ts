import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "user" })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", name: "name" })
  name: string;

  @Column({ type: "varchar", unique: true, name: "email" })
  email: string;

  @Column({ type: "varchar", name: "password" })
  password: string;

  @Column({ type: "varchar", default: null, name: "phone" })
  phone: string;

  @Column({ type: "bit", default: false, name: "active" })
  active: boolean;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    name: "date_created",
  })
  dateCreated: string;

  @Column({ type: "varchar", name: "version_term_of_use_accepted" })
  versionTermsOfUseAccepted: string;
}
