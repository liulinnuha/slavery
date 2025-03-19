```markdown
# Slavery WhatsApp Bot

A powerful WhatsApp bot built with TypeScript that includes various features like downloader, fun commands, group management, and more.

## Features

### 📥 Downloader
- **TikTok** - Download TikTok videos
- **YouTube** - Download YouTube videos (MP3/MP4)

### 🎮 Fun Commands
- **Fake User** - Generate random fake user profiles
- **Jokes** - Get random jokes
- **Memes** - Fetch random memes
- **Quotes** - Get motivational quotes
- **Random Cat/Dog** - Get cute animal pictures
- **Random Waifu** - Get random anime waifu images
- **Trivia Quiz** - Interactive quiz game with leaderboard

### 👥 Group Management
- **Left Warm** - Customize left messages
- **Tag All** - Mention all group members
- **Welcome Warm** - Customize welcome messages

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/slavery-ts.git
cd slavery-ts
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
Create a `.env` file in the root directory with:
```env
PREFIX=!
BOT_NAME=Slavery
BOT_OWNER=yourname
MONGODB_URI=your_mongodb_uri
```

4. Build and run
```bash
npm run build
npm start
```

## Usage

Commands generally follow this format:
```
!<command> [arguments]
```

Example:
```
!ytmp3 https://youtube.com/watch?v=...
```

## Requirements

- Node.js v14 or higher
- MongoDB
- TypeScript
- FFmpeg (for media processing)

## Tech Stack

- TypeScript
- @whiskeysockets/baileys
- MongoDB/Mongoose
- Axios
- Other dependencies (see package.json)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Baileys](https://github.com/whiskeysockets/baileys) - WhatsApp Web API
- All contributors and developers of the libraries used in this project

## Contact

Project Link: [https://github.com/liulinnuha/slavery](https://github.com/liulinnuha/slavery)
```
