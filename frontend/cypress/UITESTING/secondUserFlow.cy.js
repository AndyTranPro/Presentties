import 'cypress-file-upload';

describe('Second Flow include multi account switching', () => {
  const name2 = 'Ray2'
  const email2 = 'b@b.b'
  const password2 = 'baby'
  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })

  it('Start Flow', () => {
    // Register Ray2 successfully
    cy.get('[data-testid="toRegister"]').should('be.visible').click()
    cy.get('[data-testid="name"]').focus().type(name2)
    cy.get('[data-testid="email"]').focus().type(email2)
    cy.get('[data-testid="password"]').focus().type(password2)
    cy.get('[data-testid="comfirmpass"]').focus().type(password2)
    cy.get('[data-testid="submitRegister"]').should('be.visible').click()

    // Add Presentation Successfully
    cy.get('[data-testid="addNew"]').should('be.visible').click()
    cy.get('[data-testid="title"]').focus().type('New Presentation')
    cy.get('[data-testid="submit"]').should('be.visible').click()
    cy.get('[data-testid="pre"]').should('be.visible').first().click()

    // Updates Thumbnail and title
    cy.get('[data-testid="editThumbnail"]').should('be.visible').click()
    // Fail as image is required
    cy.get('[data-test-id="submit"]').should('be.visible').click()
    // success
    cy.get('[data-testid="thumbnail-upload"]').attachFile('pic.png')
    cy.get('[data-test-id="submit"]').should('be.visible').click()
    // Edit title
    cy.get('[data-testid="editbtn"]').should('be.visible').click()
    cy.get('[data-testid="editTitleInput"]').focus().type('Spooky Title')
    cy.get('[data-testid="submitNewTitle"]').should('be.visible').click()

    // Logout Ray2 successfully
    cy.get('[data-testid="logout"]').should('be.visible').click()

    // Login Ray successfully
    const name = 'Ray'
    const email = 'a@a.a'
    const password = 'strongPassword'
    cy.get('[data-testid="emailInput"]').focus().type(email)
    cy.get('[data-testid="passwordInput"]').focus().type(password)
    cy.get('[data-testid="submitLogin"]').should('be.visible').click()

    //edit presentation
    cy.get('[data-testid="pre"]').should('be.visible').first().click()

    // log out from edit presentation page
    cy.get('[data-testid="logout"]').should('be.visible').click()

    // log in Ray2 again successfully
    cy.get('[data-testid="emailInput"]').focus().type("b@b.b")
    cy.get('[data-testid="passwordInput"]').focus().type("baby")
    cy.get('[data-testid="submitLogin"]').should('be.visible').click()
    // Add Presentation Successfully
    cy.get('[data-testid="addNew"]').should('be.visible').click()
    cy.get('[data-testid="title"]').focus().type('man  what can i say')
    cy.get('[data-testid="submit"]').should('be.visible').click()
    cy.get('[data-testid="pre"]').should('be.visible').first().click()

    // Logout Ray2 successfully
    cy.get('[data-testid="logout"]').should('be.visible').click()

    // Login Ray successfully
    cy.get('[data-testid="emailInput"]').focus().type(email)
    cy.get('[data-testid="passwordInput"]').focus().type(password)
    cy.get('[data-testid="submitLogin"]').should('be.visible').click()

    // log back into Ray2 and finish
    cy.get('[data-testid="logout"]').should('be.visible').click()
    cy.get('[data-testid="emailInput"]').focus().type("b@b.b")
    cy.get('[data-testid="passwordInput"]').focus().type("baby")
    cy.get('[data-testid="submitLogin"]').should('be.visible').click()
  })
})

