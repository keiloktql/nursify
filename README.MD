# Nursify Telegram Bot

Nursify is a Telegram bot designed to assist users in understanding medical reports, medications, and conditions. Users can submit text or photos containing medical information, and Nursify will process the content using OCR (Optical Character Recognition) to extract text and GPT (Generative Pre-trained Transformer) to generate a simplified explanation.

## Features

-   **Text and Photo Submission**: Users can submit medical reports or medications either as plain text or as photos.

-   **OCR Integration**: Nursify utilizes Optical Character Recognition to extract text from submitted images.

-   **GPT-based Explanation**: The bot employs GPT (Generative Pre-trained Transformer) to generate simplified explanations of medications and medical conditions.

## Usage

1. **Start the Bot**: Start a conversation with Nursify on Telegram by searching for @nursify_bot.

2. **Submit Information**: Share your medical reports or medications either as plain text or photos within the chat.

3. **Processing**: Nursify will process the submitted content using OCR and GPT to provide a simplified explanation.

4. **Receive Explanation**: Get a clear and concise explanation of the medical information you provided.

## Technologies Used

-   [Grammy](https://github.com/grammyjs/grammy): A Telegram bot framework for Javascript.

-   [Tessearct](https://github.com/tesseract-ocr/tesseract) OCR (Optical Character Recognition) which is used to extract text from images.

-   [OpenAI](https://openai.com/) GPT (Generative Pre-trained Transformer): Employed for generating simplified explanations.
