# Consume with Intent Chrome Extension

## Overview

The Consume with Intent Chrome extension is designed to help users analyze web page content based on specific intent criteria. It can either process the content locally or send it to an external AI service for analysis.

## Features

- **Intent Criteria Management**: Users can create, edit, and delete custom intent criteria.
- **Local Processing**: Analyze page content based on active criteria without external services.
- **Integrated AI Processing**: Option to send content to an external AI service for advanced analysis.
- **Active Criteria Selection**: Choose which intent criteria to apply when analyzing pages.

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/rkwai/demand-view.git
   ```

2. Open Chrome (or any Chromium-based browser) and navigate to `chrome://extensions/`.

3. Enable "Developer mode" in the top right corner.

4. Click "Load unpacked."

5. Select the `demand-view` directory.

6. The extension should now be installed.

## Usage

### Setting Up Options

1. Click on the extension icon in the Chrome toolbar and select "Options", or right-click and choose "Options".
2. Configure Integrated AI Processing (optional):
   - Check "Enable Integration" to use an external AI service.
   - Enter the Webhook URL for your AI service.
3. Manage Intent Criteria:
   - Add new criteria by entering a name and criteria, then clicking "Add Criteria".
   - Edit existing criteria by clicking "Edit", making changes, and clicking "Update Criteria".
   - Delete criteria by clicking the "Delete" button next to the criteria.
4. Set Active Criteria:
   - Select the desired criteria from the "Active Criteria" dropdown menu.
5. Click "Save" to store your settings.

### Analyzing Web Pages

1. Navigate to the web page you want to analyze.
2. Click the extension icon in the Chrome toolbar.
3. In the popup, click the "Consume with Intent" button.
4. The extension will process the page content based on your active criteria:
   - If integration is disabled, it will copy the content and criteria to your clipboard.
   - If integration is enabled, it will send the content to your specified webhook URL for processing.
5. The results will be displayed in the extension popup.

## Troubleshooting

- Ensure you have set up at least one intent criteria and selected an active criteria.
- Verify the webhook URL if using integrated AI processing.
- Try refreshing the page or restarting Chrome if issues persist.
- For persistent problems, uninstall and reinstall the extension.

Remember to respect website terms of service and privacy policies when using this extension to analyze web content.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
