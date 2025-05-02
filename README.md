
Built by https://www.blackbox.ai

---

```markdown
# Closet Capture

👗 Closet Capture is a web application designed to help users manage their wardrobe by capturing or uploading photos of clothing items. It leverages TensorFlow.js with the coco-ssd model to detect items in images, providing an engaging way to maintain a virtual closet.

## Project Overview

Closet Capture allows users to:
- Capture or upload images of clothing items.
- Automatically detect clothing items in the uploaded images using AI.
- Manually add items to the virtual closet.
- Edit or delete items in the virtual closet.
- View items grouped by type in a visually appealing interface.

## Installation

To run Closet Capture locally, follow these steps:

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/yourusername/closet-capture.git
   cd closet-capture
   ```

2. **Open `index.html` in a Web Browser:**
   You can simply open the `index.html` file in any modern web browser (like Chrome, Firefox, etc.) to start using the application.

## Usage

1. **Upload Photos:**
   Click on the "Captura o sube fotos del armario" button to upload images.

2. **Detect Items:**
   After uploading, click the "Detectar artículos" button to automatically identify clothing items in the pictures.

3. **Manage Closet Items:**
   - To add an item manually, click on the "+" button.
   - To edit or delete items, select the item and use the respective buttons.

4. **View Your Closet:**
   The items will be displayed in a well-organized grid layout grouped by type.

## Features

- Image upload capability for clothing items.
- Automatic detection of clothing items using TensorFlow.js.
- User-friendly interface with responsive design.
- Ability to add, edit, and delete items from the wardrobe.
- Data persistence using `localStorage`, keeping your closet intact between sessions.

## Dependencies

The project includes the following dependencies:
- [TensorFlow.js](https://www.tensorflow.org/js) - v4.2.0 for object detection.
- [Coco-SSD](https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd) - TensorFlow.js model for object detection.
- [Tailwind CSS](https://tailwindcss.com/) - for styling the application.

## Project Structure

```plaintext
/
├── index.html      # The main HTML file for the application
├── app.js          # JavaScript file containing the application logic
├── styles.css      # CSS file with styles for the application
```

### HTML Structure
- The `index.html` file is structured with a header, a main section for interacting with the closet, and modals for adding or editing items.

### JavaScript Functionality
- The `app.js` file handles the application logic including loading models, detecting items, managing local storage for closet items, and updating the UI.

### CSS Styling
- The `styles.css` file provides styling for the application, creating a modern and user-friendly interface.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes, enhancements, or bug fixes.

## License

This project is licensed under the MIT License.

---

For any inquiries or feedback, feel free to open an issue in the repository!
```