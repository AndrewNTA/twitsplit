const chunkMessage = require('../src/utils');

describe('utils function', () => {
  describe('chunkMessage function', () => {
    it('should do not split message when message have length less than or equal to 50', () => {
      const msg = 'hello';
      const expectedResult = ['hello'];

      const actualResult = chunkMessage(msg);

      expect(actualResult).toEqual(expectedResult);
    });

    it('should through an error when message contains a span of non- whitespace characters longer than 50 characters', () => {
      const msg = 'Welcometomyapplication,thismessagewillbesplitto3sections and append indicator correctly. Awesome !!!';
      const expectedResult = {
        error: "Message contains a span of non- whitespace characters longer than 50 characters"
      };

      const actualResult = chunkMessage(msg);

      expect(actualResult).toEqual(expectedResult);
    });

    it('should through an error when message is over the max length', () => {
      const msg = 'aaaaa aaaaa';
      const longerMsg = msg.repeat(4000); // length is 44000
      const expectedResult = {
        error: "Message is over the max length"
      };

      const actualResult = chunkMessage(longerMsg);

      expect(actualResult).toEqual(expectedResult);
    });

    it('should do split message to 3 sections and append indicator correctly', () => {
      const msg = 'Welcome to my application, this message will be split to 3 sections and append indicator correctly. Awesome !!!';
      const expectedResult = [
        '1/3 Welcome to my application, this message will',
        '2/3 be split to 3 sections and append indicator',
        '3/3 correctly. Awesome !!!'
      ];

      const actualResult = chunkMessage(msg);

      expect(actualResult).toEqual(expectedResult);
    });
  });
})