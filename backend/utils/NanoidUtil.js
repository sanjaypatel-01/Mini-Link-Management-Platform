import { nanoid } from 'nanoid';

const generateShortId = () => nanoid(8);

export default generateShortId;


// Custom character set to include only lowercase and uppercase letters
// const generateShortId = () => nanoid(8).replace(/[^a-zA-Z]/g, '');

// Custom character set to include only lowercase and uppercase letters
// const generateShortId = () => {
//     const length = Math.floor(Math.random() * 3) + 7; // Random length between 7 and 9
//     return nanoid(length).replace(/[^a-zA-Z]/g, '');
// };