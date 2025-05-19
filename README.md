# FlashLearn - Spaced Repetition Flashcard App

A modern flashcard application built with React that implements the SuperMemo 2 (SM2) algorithm for efficient learning through spaced repetition.

## FlashLearn Screenshot
![{D393A4B3-BFD8-4600-A956-F0D01D634439}](https://github.com/user-attachments/assets/f565a1fb-b1c8-472a-9ffc-09e0969b865a)
![{CC24F60F-CC4F-47EC-85AE-086883126EFF}](https://github.com/user-attachments/assets/de5d6ef6-0738-4625-a969-713043ed769f)
![{899CF734-9A8D-456C-8891-2D8D665FF47D}](https://github.com/user-attachments/assets/d623508f-201c-4b08-8c58-f9d44bac6be3)
![{7088DF7E-EE6B-40F6-9B6D-237DD2169623}](https://github.com/user-attachments/assets/81549243-fe3e-496f-81ad-366c500d1a81)
![{9DE918AC-6FB4-47FB-BFAB-126FA77AD36E}](https://github.com/user-attachments/assets/1219d44a-7ae7-4c36-8265-532cd5bec7bb)
![{5EB0C07E-3F26-498B-87D4-73BDCC360D02}](https://github.com/user-attachments/assets/91fb6725-68d3-4c5f-9989-b6f2bcb5e508)


## Features

- **Spaced Repetition**: Implements the SM2 algorithm for optimal learning intervals
- **Multiple Decks**: Organize cards into different subject areas
- **Rich Statistics**: Track your learning progress with detailed stats and graphs
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Offline Support**: All data stored locally in your browser
- **Tag System**: Organize and filter cards using tags
- **Study Sessions**: Track your study progress and maintain streaks

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm 9.0 or higher

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/flashlearn.git
   cd flashlearn
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Usage

### Creating Decks

1. Click the "Create" button in the navigation
2. Enter a deck name and optional description
3. Click "Save Deck"

### Adding Cards

1. Navigate to the "Create" section
2. Select a deck
3. Enter the front and back content
4. Add optional tags
5. Click "Save Card"

### Studying

1. Choose a deck from the Decks page
2. Click "Study Now"
3. Rate your confidence after reviewing each card:
   - Again (0): Complete failure to recall
   - Hard (1): Significant difficulty
   - Good (3): Correct response with some effort
   - Easy (5): Perfect response with no hesitation

### Reviewing Stats

Visit the Stats page to view:
- Current learning streak
- Total reviews completed
- Cards learned vs. total cards
- Daily review activity
- Card mastery progress

## Technical Details

### Technologies Used

- React 18
- TypeScript
- Tailwind CSS
- Lucide React (icons)
- Vite (build tool)

### Architecture

- **Components**: Modular React components in `src/components/`
- **Pages**: Main route components in `src/pages/`
- **Utils**: Helper functions including SM2 algorithm in `src/utils/`
- **Types**: TypeScript interfaces and types in `src/types/`

### Storage

All data is stored in the browser's localStorage, including:
- Flashcards
- Decks
- Study sessions
- Review history
- User statistics

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- SuperMemo 2 algorithm by Piotr Wozniak
- Icons by Lucide React
- UI inspiration from various spaced repetition systems
