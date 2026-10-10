# NutriTrack — Smart Calorie Tracker

A beginner-friendly local website built with HTML, CSS, and vanilla JavaScript.

## Features
- Daily calorie goal and progress ring
- Food diary with meal filters (Breakfast, Lunch, Dinner, Snacks)
- Quick food list with estimated calories, protein, carbohydrates, and fats
- Serving quantity adjustment
- Delete individual foods or clear the selected date
- Calorie calculator using the Mifflin–St Jeor equation and activity multipliers
- Uses browser localStorage to remember diary entries on this browser/device
- Responsive layout for desktop and mobile

## Run it on Windows
1. Download and extract `smart_calorie_tracker.zip`.
2. Open the extracted `smart_calorie_tracker` folder.
3. Double-click `index.html`. It should open in Chrome or Edge.
4. Click **Add food** to log a meal.
5. Use **Calorie calculator** to estimate a target, then click **Use this goal**.

No Node.js, Python, database, or API key is needed.

## Optional: run with VS Code
1. Open VS Code.
2. Choose **File → Open Folder...** and select the extracted folder.
3. If you already use the Live Server extension, right-click `index.html` and choose **Open with Live Server**. Otherwise, opening `index.html` directly is enough.

## Project files
- `index.html` — page structure and interface
- `style.css` — green-and-white responsive design
- `script.js` — food list, calculator, diary actions, and dashboard calculations

## Important notes
- Food nutrition values are sample estimates per listed serving, not a verified nutrition database. Actual values vary by brand, recipe, preparation, and portion size.
- Entries are saved in this browser's localStorage. They are not synced to another device and can be cleared if browser site data is deleted.
- The calorie estimate is informational and not medical advice. The app is not a substitute for advice from a qualified healthcare professional.
- The app has no account system or cloud backup in this starter version.
