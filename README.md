# 🎮 PlayLearn - Gamified Learning Web App for Kids

> *"A safe, adaptive, gamified learning platform that teaches children through play, not pressure."*

## 📋 Overview

PlayLearn is a web-based educational platform designed for children aged 3-12 years. The MVP focuses on the 10-12 age group with two core learning modules:

- **🌍 Eco Hero Quest** - Environmental awareness through interactive scenarios
- **🛡️ Safety Shield Adventure** - Personal safety and body awareness education

## ✨ Key Features

### Core Principles
- ✅ **Play-First Learning** - No lectures, only interactive experiences
- ✅ **Adaptive Difficulty** - Real-time adjustment based on performance
- ✅ **Immediate Feedback** - Instant visual and audio responses
- ✅ **No Punishment** - Mistakes are learning opportunities
- ✅ **One Action Per Screen** - Simple, focused interactions
- ✅ **Parent Control** - Dashboard for monitoring and settings

### Technical Features
- 📱 **Fully Responsive** - Works on desktop, tablet, and mobile
- 💾 **Local Storage** - Progress saved on device (no server required)
- 🎨 **Modern UI** - Muted, mature design for 10-12 age group
- 🎵 **Audio System** - Background music and sound effects (with mute)
- 🏆 **Gamification** - Stars, badges, levels, and progress tracking
- 🧠 **Adaptive Engine** - Adjusts difficulty based on consecutive answers

## 🗂️ Project Structure

```
Gamified-learning-app/
├── index.html                 # Landing page with parent consent
├── age-selection.html         # Age group selection
├── game-hub.html             # Main game selection hub
├── eco-hero-quest.html       # Environmental learning game
├── safety-shield.html        # Personal safety game
├── parent-dashboard.html     # Parent monitoring dashboard
│
├── css/
│   ├── global.css            # Design system & base styles
│   └── animations.css        # Animation library
│
├── js/
│   ├── adaptive-engine.js    # Difficulty adjustment logic
│   ├── progress-tracker.js   # Gamification & progress
│   └── audio-manager.js      # Sound management
│
├── data/
│   ├── eco-scenarios.json    # Environmental questions
│   └── safety-scenarios.json # Safety scenarios
│
└── assets/
    └── images/
        ├── mascot.png        # Friendly guide character
        ├── eco-badge.png     # Environmental badge
        ├── safety-badge.png  # Safety badge
        ├── eco-positive.png  # Positive eco scenario
        └── eco-negative.png  # Negative eco scenario
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server or installation required!

### Running the App

1. **Open the project folder**
   ```bash
   cd Gamified-learning-app
   ```

2. **Open `index.html` in your browser**
   - Double-click `index.html`, or
   - Right-click → Open with → Your browser, or
   - Use a local server (optional):
     ```bash
     # Python 3
     python -m http.server 8000
     
     # Node.js (if you have http-server installed)
     npx http-server
     ```

3. **Start playing!**
   - Check the parent consent checkbox
   - Select age group (10-12 for MVP)
   - Choose a game and start learning!

## 🎮 How to Play

### For Children

1. **Landing Page**
   - Parent checks the consent box
   - Click "Start Learning Adventure"

2. **Age Selection**
   - Choose "10-12 Years" (other ages coming soon!)

3. **Game Hub**
   - Select either game:
     - 🌍 Eco Hero Quest
     - 🛡️ Safety Shield Adventure

4. **Playing Games**
   - Read each scenario carefully
   - Choose the best answer
   - Get instant feedback
   - Earn stars and level up!
   - Complete all 10 questions

5. **Track Progress**
   - View stars earned
   - Unlock badges
   - See completion stats

### For Parents

1. **Access Dashboard**
   - Click "Parents" in the bottom navigation
   - View comprehensive progress reports

2. **Monitor Activity**
   - Total stars earned
   - Badges unlocked
   - Games completed
   - Session time

3. **Control Settings**
   - Enable/disable safety module
   - Toggle sound effects
   - Export progress reports
   - Reset all progress

## 🧠 Adaptive Learning System

The app automatically adjusts difficulty based on performance:

- **2 Correct Answers in a Row** → Level Up (harder questions)
- **2 Wrong Answers in a Row** → Level Down (easier questions)
- **Silent Operation** → No notifications to the child
- **5 Difficulty Levels** → Gradual progression

## 🏆 Gamification System

### Stars ⭐
- Earned for correct answers
- Points vary by difficulty level
- Displayed in real-time

### Badges 🏆
- **First Star** - Earn your first star
- **Star Collector** - Earn 50 stars
- **Star Master** - Earn 100 stars
- **Eco Warrior** - Complete Eco Hero Quest
- **Safety Champion** - Complete Safety Shield Adventure
- **Perfect Score** - Complete any game with 100% accuracy

### Progress Tracking
- Level progression
- Accuracy percentage
- Completion status
- Session duration

## 🎨 Design Philosophy

### Age 10-12 Specific Design
- **Muted Color Palette** - No childish bright colors
- **Story-Driven** - Narrative-based learning
- **Decision-Based** - Choices with consequences
- **Respectful UI** - Mature, clean interface
- **Minimal Text** - Visual-first approach

### Accessibility
- High contrast text
- Large touch targets
- Keyboard navigation support
- Reduced motion option
- Screen reader friendly

## 📊 Data & Privacy

### What's Stored
- Game progress (local storage only)
- Stars and badges earned
- Completion statistics
- Parent settings

### What's NOT Stored
- No personal information
- No external tracking
- No server uploads
- No third-party analytics

### Data Location
All data is stored in browser's `localStorage`:
- `parentConsent` - Consent status
- `selectedAgeGroup` - Age selection
- `progressData` - Stars, badges, completions
- `gameData` - Individual game statistics
- `adaptiveProgress` - Difficulty level
- `audioSettings` - Mute preferences

## 🔧 Customization

### Adding New Scenarios

1. **Edit JSON files** in `data/` folder:
   ```json
   {
     "id": 11,
     "level": 3,
     "type": "choice",
     "question": "Your question here?",
     "options": [
       {
         "id": "a",
         "text": "Option A",
         "correct": true,
         "feedback": "Great job!",
         "points": 20
       }
     ]
   }
   ```

2. **Refresh the browser** - Changes load automatically!

### Customizing Colors

Edit `css/global.css` CSS variables:
```css
:root {
    --primary-blue: #4A90E2;
    --primary-purple: #7B68EE;
    /* Add your colors */
}
```

### Adding Audio Files

1. Place audio files in `assets/audio/`
2. Update `audio-manager.js` to reference them
3. Supported formats: MP3, WAV, OGG

## 🐛 Troubleshooting

### Progress Not Saving
- Check browser's localStorage is enabled
- Avoid incognito/private browsing mode
- Clear cache and try again

### Images Not Loading
- Verify images are in `assets/images/`
- Check file names match exactly (case-sensitive)
- Ensure browser supports PNG format

### Games Not Loading
- Check browser console for errors (F12)
- Verify JSON files are valid
- Ensure JavaScript is enabled

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🎯 Future Enhancements

### Planned Features
- [ ] Age groups 3-5 and 6-9 implementation
- [ ] Multi-language support (English + Indian languages)
- [ ] Voice recognition for rhyme module
- [ ] More game modules
- [ ] Offline PWA support
- [ ] Print certificates
- [ ] Parent email reports

### Content Expansion
- [ ] Math games (6-9 age group)
- [ ] Language games (6-9 age group)
- [ ] Rhymes module (3-5 age group)
- [ ] Color matching (3-5 age group)
- [ ] Animal sounds (3-5 age group)

## 📄 License

This project is created for educational purposes. Feel free to use and modify for non-commercial educational use.

## 🤝 Contributing

This is a hackathon MVP. Contributions welcome!

1. Fork the repository
2. Create your feature branch
3. Test thoroughly
4. Submit a pull request

## 📞 Support

For questions or issues:
- Check the troubleshooting section
- Review browser console for errors
- Ensure all files are in correct locations

## 🎉 Acknowledgments

- Designed for children's safety and learning
- Built with modern web standards
- No external dependencies
- Privacy-first approach

---

**Made with ❤️ for children's education**

*Version: 1.0.0 (MVP)*  
*Last Updated: January 2026*
