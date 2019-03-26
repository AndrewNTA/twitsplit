# TWITSPLIT

TWITSPLIT is a simple javascript application to resolve problems when user write messages longer than 50 characters. We will split the message into parts and send multiple messages on the user's behalf, all of them meeting the 50 character requirement.

This app use [Bootstrap](https://getbootstrap.com/) library to render UI.

## Example
Suppose the user wants to send the following message:
"I can't believe Tweeter now supports chunking my messages, so I don't have to do it myself."
This is 91 characters excluding the surrounding quotes. When the user presses send, it
will send the following messages:
"1/2 I can't believe Tweeter now supports chunking" "2/2 my
messages, so I don't have to do it myself."
Each message is now 49 characters, each within the allowed limit

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install twitsplit.

```bash
npm install
```
## Start

```bash
npm start
```

## Build

```bash
npm run build
```

## License
[MIT](https://choosealicense.com/licenses/mit/)

# Documents

## 1.	Analysis of the problem
-	Message will only be split on whitespace, so we need to find the location of the space to cut accordingly.
-	The part indicator which appended to the beginning of each section is counted toward the character limit. Because an indicator is a dynamic number and it can be changed when increasing the number of the sections. So, we are difficult to find the location to split to make sure each section is less than or equal to 50 characters.

## 2.	Approach
-	My approach: I will predict the maximum number of sections will be split. Based on the number of characters of the maximum section, I will calculate the number of characters of the indicator which appended to the beginning of each section.
-	The maximum number of characters of all indicators base on the formula (limited 999 sections of message):
(x+3) + 8(x+2) + 90(x+3) + 900(x+4)
(x is a number of digits of max section number)
Example: 
If a message is split maximum for 9 sections. The value of “x” is 1. The maximum number of characters of all indicators is (4 + 8*3 = 28). Therefore, a message is split to maximum 9 sections – each section is less than or equal to 50 characters, must be max length of characters is (9*50 – 28 = 422).
Base on the above formula, I have a function forecastNumberDigitsOfMaxSplitMsg to forecast the number of digits of max section number (x).
-	The next, I will add the first indicator 1/x_ to the beginning of string message. Iterator the end of the string message, find the location to split, get split message sections and push it in a result array. Then, I will get the number of sections, and append indicator to each message section base on the number of sections. Finally, I will get verify this result to make sure each section is less than or equal to 50 characters. If it is not correct, I will increase the forecastNumber and do it again.

## 3.	Advantages
-	I have stored all index of whitespace into an array to find the location to split as quickly as possible.
-	I have a function to forecast the number of maximum sections to ensure the number of loops to split message is the least.
-	The complexity of my approach is O(n). There aren’t 2 nested loops.

## 4.	Limitations
-	This solution is difficult to explain to everyone.
-	This solution limits the maximum of sections by split message is 999;



