// import { checkPropTypes } from 'prop-types';
context('Happy Path for App', () => {
  beforeEach(() => {
    cy.visit('localhost:3000');
  });

  it('Happy path', () => {
    cy.get('span').then((text) => {
      expect(text.text()).to.contain('welcome!');
    }); 

    // register
    const registerTap = cy.get('#registerpage');
    registerTap.click();
    const email = '953@qq.co1122';
    const password = '61751589JJy';
    const name = 'jjyy';
   
    cy.get('.registerEmail').type(email);
    cy.get('.registerPassword').type(password);
    cy.get('.registerName').type(name);
    cy.get('#registerbutton').click();

    cy.get('#gotoLogin').click();


    //login

    const emailLogin = '953@qq.co1122';
    const passwordLogin = '61751589JJy';
   
    cy.get('.loginEmail').type(emailLogin);
    cy.get('.loginPassword').type(passwordLogin);
    cy.get('#loginbutton').click();


    // create a new game
    cy.get('#createGame').click();

    cy.get('h2').then((text) => {
      expect(text.text()).to.contain('Game Name:');
    }); 
    cy.get('#enterGame').type('name');
    cy.get('#newgame').click();
    cy.get('#confirm').click();

    //edit a game 
    cy.get('#editGame').click();

    cy.get('h2').then((text) => {
      expect(text.text()).to.contain('Edit your game!');
    }); 
    cy.get('#outlined-multiline-flexible-name').type('Gamename');
    cy.get('#addquestion').click();
    cy.get('#fullWidthQuestion').click().type('Gamename');
    cy.get('#confirmQuestion').click();
    cy.get('#confirm').click();

    cy.get('b').then((text) => {
      expect(text.text()).to.contain('Gamename');
    }); 

    cy.get('#confirmGame').click();

    // start a game 

    cy.get('#startGame').click();
    cy.get('#CopyLink').click();
    cy.get('#stopGame').click();
    cy.get('#yes').click();
  })
});
