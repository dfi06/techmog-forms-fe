# Techmog Forms

A website to make and create forms.

Techstack:

- Nextjs Frontend, Deployed on Vercel
- Expressjs Backend, Deployed on Vercel
- Mongodb Database, Deployed on Mongodb Atlas

---

## Website live on

**[Techmog Forms](techmog-forms-fe.vercel.app)**

Performance may be inconsistent due to 3rd party deployment resources

---

## Project repositories

- **Frontend**: [techmog-forms-fe](https://github.com/dfi06/techmog-forms-fe)
- **Backend**: [techmog-forms-be](https://github.com/dfi06/techmog-forms-be)

---

## Running locally

Ensure you have git and Node installed

clone the two repos in separate folders each using

```
git clone <repo url> 
```

name them however you want, for example frontend and backend

create .env for frontend folder:

```
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

create .env for backend folder:

```
MONGODB_URI= <obtain by creating a cluster in MongoDB Atlas>
JWT_SECRET=supersecretkey
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:3001
```

run a terminal for each folder. For both terminals, run

```
npm i
npm run dev
```

note: if backend fails to run, I had an issue where mongodb atlas refuses to connect unless I turn on cloudflare's 1.1.1.1 warp vpn

the local only site should be available on `http://localhost:3000`
