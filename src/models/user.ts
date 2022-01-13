import client from '../database';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();


export type User = {
  id?: number,
  firstname: string,
  lastname: string,
  password: string
}

const pepper = process.env.BCRYBT_PASSWORD as string;
const saltRounds = process.env.SALT_ROUNDS as string;

export class UserStore {
  async index(): Promise<User[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM users';
      const result = await conn.query(sql);
      conn.release();
      return result.rows as User[];
    } catch (error) {
      throw new Error(`Unable to get users: ${error}`);
    }
  }


  async show(id: number): Promise<User> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM users WHERE id=($1)';
      const result = await conn.query(sql, [id]);

      conn.release();
      return result.rows[0] as User;
    } catch (error) {
      throw new Error(`Unable to get user: ${error}`);
    }
  }


  async create(user: User): Promise<User> {
    try {
      const conn = await client.connect();
      const sql = 'INSERT INTO users (firstname, lastname, password) VALUES($1, $2, $3) RETURNING *';
      const hash = bcrypt.hashSync(
        user.password + pepper,
        parseInt(saltRounds)
      );

      const result = await conn.query(sql, [user.firstname, user.lastname, hash]);
      const newUser = result.rows[0] as User;

      conn.release();
      return newUser;
    } catch (err) {
      throw new Error(`unable create user (${user.firstname, user.lastname}): ${err}`);
    }
  }



  async authenticate(firstname: string, password: string): Promise<User | null> {
    const conn = await client.connect()
    const passwordSql = 'SELECT password FROM users WHERE firstname=($1)';
    const result = await conn.query(passwordSql, [firstname])
    // console.log(password+pepper)
    if (result.rows.length > 0) {
      const userSql = 'SELECT * FROM users WHERE firstname=($1)';
      const passowrd = result.rows[0];
      // console.log(user);
      if (bcrypt.compareSync(password + pepper, passowrd)) {
        const user = await conn.query(userSql, [firstname])
        return user.rows[0];
      }
    }
    return null;
  }
  // async authenticate(firstname: string, password: string): Promise<User | null> {
  //   const conn = await client.connect()
  //   const sql = 'SELECT password FROM users WHERE firstname=($1)';
  //   const result = await conn.query(sql, [firstName])
  //   // console.log(password+pepper)
  //   if (result.rows.length) {
  //     const user = result.rows[0];
  //     // console.log(user);
  //     if (bcrypt.compareSync(password + pepper, user.password_digest)) {
  //       return user;
  //     }
  //   }
  //   return null;
  // }

}