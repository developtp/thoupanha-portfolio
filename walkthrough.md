# Portfolio Setup & Deployment Walkthrough

This guide provides a comprehensive, step-by-step walkthrough of how to set up your MERN stack portfolio locally, configure your MongoDB database, deploy your application to an AWS CloudHost environment, and demonstrate that all requirements (including the Contact form and full CRUD) are met.

---

## Part 1: Local Setup & Database Configuration

### 1. Set Up MongoDB Atlas (Cloud Database)
To ensure your app works both locally and on AWS, we will use MongoDB Atlas.

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas/database) and create a free account.
2. Build a **Free Cluster** (M0 sandbox).
3. Under **Database Access**, create a new database user with a username and password. Remember these credentials.
4. Under **Network Access**, add a new IP address. Select **"Allow Access from Anywhere"** (`0.0.0.0/0`). This ensures AWS can connect to your database later.
5. Go to **Clusters** -> **Connect** -> **Connect your application**.
6. Copy the connection string. It will look something like this:
   `mongodb+srv://<username>:<password>@cluster0.mongodb.net/portfolio?retryWrites=true&w=majority`

### 2. Configure Local Environment Variables
In your local repository, navigate to the `backend/` directory and update the `.env` file with the MongoDB Atlas string you just copied.

```env
PORT=5000
MONGO_URI=mongodb+srv://yourUsername:yourPassword@cluster0...
```

### 3. Run the App Locally
Open two terminal windows in VS Code.

**Terminal 1 (Backend):**
```bash
cd backend
npm install
node server.js
# You should see: "Server running on port 5000" and "MongoDB connected"
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm install
npm run dev
# The frontend will be available at http://localhost:5173
```

---

## Part 2: Testing Features (Meeting Requirements)

Before deploying, verify everything works locally.

### 1. The Contact Form
1. Go to `http://localhost:5173#contact`.
2. Fill out the **Name**, **Email**, and **Message**.
3. Click **Send Message**.
4. To verify it reached the backend: Navigate to `http://localhost:5173/admin` and scroll down to the **Messages** section. You should see your submitted message there. This proves your frontend is successfully posting to your Express API and saving to MongoDB.

### 2. Full Project CRUD
1. Navigate to the hidden admin dashboard: `http://localhost:5173/admin`.
2. **Create:** Use the left form to add 3 distinct projects. Fill in the title, description, tech stack, and a sample image URL. Click "Add Project".
3. **Read:** Look at the right side of the screen. Your new projects will appear instantly. Go to `http://localhost:5173/#projects` to ensure they also render on the public portfolio.
4. **Update:** In the Admin panel, click **Edit** on one of the projects. The form on the left will populate with the project's data. Change the title or description and click "Update Project".
5. **Delete:** Click **Delete** on a project to remove it from the database permanently.

This perfectly demonstrates the requirement for "at least one complete CRUD feature".

---

## Part 3: Deploying to AWS CloudHost

To host this on AWS, we will deploy the Node.js backend to an **AWS EC2 Instance** (Elastic Compute Cloud) and host the React frontend on a simpler static host like **AWS Amplify**. 

> [!WARNING]
> Make sure your frontend API calls point to your AWS backend URL, not `http://localhost:5000`.
> In `frontend/src/pages/Admin.jsx`, `frontend/src/pages/Home.jsx`, `frontend/src/components/ProjectsList.jsx`, and `frontend/src/components/ContactForm.jsx`, set the API base URL to `http://54.226.255.19:5000/api`.

### Step A: Deploy the Backend to AWS EC2
1. Log into the AWS Management Console and go to **EC2**.
2. Click **Launch Instance**.
3. **Name:** `Portfolio-Backend`
4. **AMI:** Choose **Ubuntu 22.04 LTS**.
5. **Instance Type:** `t2.micro` (Free tier eligible).
6. **Key Pair:** Create a new key pair (e.g., `portfolio-key.pem`) and download it.
7. **Network Settings:** Check the boxes for **Allow HTTP traffic** and **Allow HTTPS traffic**.
8. Launch the instance.

**Connect to your EC2 instance and set up Node:**
1. Once running, select the instance and click **Connect**. Use EC2 Instance Connect (the browser-based terminal).
2. Run the following commands to install Node.js and Git:
   ```bash
   sudo apt update
   sudo apt install nodejs npm -y
   ```
3. Clone your repository (you'll need to push your code to GitHub first):
   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name/backend
   npm install
   ```
4. Create your `.env` file on the server:
   ```bash
   nano .env
   ```
   *Paste your `MONGO_URI` and `PORT=5000`, then press `CTRL+X`, `Y`, and `Enter`.*
5. Keep the server running forever using PM2:
   ```bash
   sudo npm install -g pm2
   pm2 start server.js
   ```

**Open Port 5000 on AWS:**
1. In the EC2 console, go to the **Security Group** attached to your instance.
2. Edit **Inbound Rules**.
3. Add a rule: **Custom TCP**, Port **5000**, Source **Anywhere-IPv4** (`0.0.0.0/0`).
4. Your backend is now live at `http://<YOUR-EC2-PUBLIC-IP>:5000`.

### Step B: Deploy the Frontend to AWS Amplify
AWS Amplify makes deploying React apps incredibly easy.

1. Ensure your React code (with the API URLs updated to your EC2 Public IP) is pushed to GitHub.
2. In the AWS Console, search for **AWS Amplify**.
3. Click **New App -> Host web app**.
4. Select **GitHub** and authorize AWS to access your repositories.
5. Select your portfolio repository and the `main` branch.
6. Check the box indicating your app is in a monorepo, and set the root directory to `frontend`.
7. Click **Next**, then **Save and Deploy**.
8. AWS Amplify will build your Vite React app and provide you with a live, public `.amplifyapp.com` URL.

---

## Final Review Against Requirements

- [x] **React Frontend:** Built with Vite and deployed via AWS Amplify.
- [x] **REST API & Node Backend:** Built with Express, hosted on AWS EC2.
- [x] **MongoDB:** Hosted globally on MongoDB Atlas.
- [x] **3 Projects Minimum:** Easily added via the Admin panel.
- [x] **Full CRUD:** Completely satisfied by the `/admin` dashboard logic.
- [x] **Contact Form:** Successfully POSTs to the backend and saves to the database.
- [x] **Public Deployment:** Fully deployed using the AWS Cloud ecosystem.
- [x] **Light/Dark Theme Toggle:** Persistent theme system with premium CSS custom properties and interactive sun/moon SVG switch.

---

## Part 4: Light/Dark Theme System & Visual Refinements

We have added a premium, fully customized Light and Dark theme toggle system to the personal portfolio website.

### 1. Unified Theme Token System
Every visual property (colors, gradients, glass borders, noise, glow effects, shadows, input elements, PIN page, drag-drop component, and easter egg modals) has been audited and refactored to use standard CSS variables (`var(--token)`).
- **Dark Mode (Default):** Deep dark layout (`#121212`) paired with rich orange accents (`#FF5722`) and light glassy highlights.
- **Light Mode:** Softer off-white surfaces (`#F7F7F5`), near-black headers (`#1A1A1A`), tuned translucencies, and lower-opacity screen-blend glow blobs.

### 2. Animated Sun/Moon Toggle Button
- Integrated seamlessly into the navigation header.
- Uses inline SVGs for the sun and moon shapes that rotate, scale, and cross-fade smoothly during state changes.
- Persists user preferences inside `localStorage` and initialises on boot without a flash of default dark mode.
- Fully accessible with keyboard navigation (`focus-visible` ring) and screen reader support (`aria-label`).

### 3. Visual Element Theming
The visual system is now 100% theme-aware:
- **PIN Authorization Gate:** Modals and input boxes now use theme variables (`--pin-box-bg`, `--pin-box-border`).
- **Drag & Drop Upload:** Form sections now use `--admin-form-bg` and `--drag-drop-border`.
- **Easter Egg Modal:** Backdrop and card styles respect variables (`--glass-bg`, `--glass-inset`, `--glass-ring`).
- **Dot Pattern Background:** Radial gradients now scale visibility using `--dot-color` instead of hardcoded white dots.

### 4. Dynamic Profile Settings (Hero & Bio intro)
You can now edit your home page text dynamically:
- **Admin Inputs:** Change the Hero Title, Hero Subtitle, and Bio Intro text in the new **Profile Settings** panel inside the admin dashboard.
- **Rich Text Support:** The fields support HTML markup rendering via `dangerouslySetInnerHTML`. You can format text using `<strong>` for bolding, `<u>` for underlining, or `<span class="highlight">` to apply the theme's orange accent color to text segments.
- **Navbar Cleanups:** The navbar Contact Me button has been simplified into a standard text link ("Contact") next to About and Projects for clean visual cohesion.

You are now fully prepared for your final presentation!
