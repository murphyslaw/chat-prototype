import { User } from "@prisma/client";
import styles from "./page.module.css";

async function fetcher(input: RequestInfo) {
  const res = await fetch(input);

  if (!res.ok) throw new Error("An error occurred.");

  return res.json();
}

export default async function Home() {
  const users = await fetcher("http://localhost:3000/api/users");

  if (!users) return <div>Loading...</div>;
  console.log(users);

  return (
    <main className={styles.main}>
      <ul>
        <li>Hello, World!</li>
        {users.map((user: User) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </main>
  );
}
