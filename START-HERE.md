# Start the Crochet App

## Step 1: Open Terminal in this folder

- In Cursor: **Terminal → New Terminal**
- Or: Right-click this folder → "Open in Terminal"
- Or: Open Command Prompt, then run: `cd c:\Users\Ananya\OneDrive\Desktop\Crochet\crochet-app`

## Step 2: Set Node path (if npm not found)

```
set PATH=C:\Program Files\nodejs;%PATH%
```

## Step 3: Stop old servers (important!)

```
taskkill /F /IM node.exe
```

Wait 3 seconds, then continue.

## Step 4: Start the app

```
npm run dev
```

## Step 5: Wait for "Ready"

You'll see something like:
```
▲ Next.js 14.2.35
- Local: http://localhost:3000
✓ Ready in 5s
```

## Step 6: Open in browser

Click the link or type in browser:
- **http://localhost:3000**
- Or **http://127.0.0.1:3000**
- If 3000 is busy, try **3001** or **3002** (check the terminal for the port)

---

## Test pages

- **http://localhost:3000** - Main site
- **http://localhost:3000/simple** - Minimal test page (no video, no extras)

---

## If it still doesn't load

1. **Open test-browser.html** - Double-click `test-browser.html` in this folder. Does it open? If yes, your browser works.
2. **Check firewall** - Windows may ask to allow Node. Click "Allow".
3. **Try different browser** - Chrome or Edge.
4. **Move project** - Copy the whole `crochet-app` folder to `C:\Crochet` (outside OneDrive) and run from there. OneDrive can sometimes cause issues.
