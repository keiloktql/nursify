# Nursify Telegram Bot

Welcome to Nursify, your personal health assistant on Telegram! Nursify is a Telegram bot designed to assist users in understanding medical reports, medications, and conditions. Users can submit text or photos containing medical information, and Nursify will process the content using OCR (Optical Character Recognition) to extract text and GPT (Generative Pre-trained Transformer) to generate a simplified explanation. Additionally, Nursify collects user data, including the user's country of origin, and stores it in a Supabase database. The bot also features a reminder function to set reminders for medication.

## Features

-   **Text and Photo Submission**: Users can submit medical reports or medications either as plain text or as photos.

-   **OCR Integration**: Nursify utilizes Optical Character Recognition to extract text from submitted images.

-   **GPT-based Explanation**: The bot employs GPT (Generative Pre-trained Transformer) to generate simplified explanations of medications and medical conditions.

-   **User Data Collection**: Nursify collects and stores user data, including the user's country of origin, in a Supabase database.

-   **Reminder Function**: Users can set reminders for medication.

## Usage

1. **Start the Bot**: Start a conversation with Nursify on Telegram by searching for @nursify_bot.

2. **Submit Information**: Share your medical reports or medications either as plain text or photos within the chat.

3. **Processing**: Nursify will process the submitted content using OCR and GPT to provide a simplified explanation.

4. **Receive Explanation**: Get a clear and concise explanation of the medical information you provided.

## Technologies Used

-   [Grammy](https://github.com/grammyjs/grammy): A Telegram bot framework for Javascript.

-   [Tessearct](https://github.com/tesseract-ocr/tesseract) OCR (Optical Character Recognition) which is used to extract text from images.

-   [OpenAI](https://openai.com/) GPT (Generative Pre-trained Transformer): Employed for generating simplified explanations.

-   [Supabase](https://supabase.com/) Supabase used for storing of information.
