/// <reference types="cypress" />

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress
import 'cypress-file-upload';

describe('Flow1', () => {
  const name = 'Ray'
  const email = 'a@a.a'
  const password = 'strongPassword'
  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })

  it('Start Flow', () => {
    // Register successfully
    cy.get('[data-testid="toRegister"]').should('be.visible').click()
    cy.get('[data-testid="name"]').focus().type(name)
    cy.get('[data-testid="email"]').focus().type(email)
    cy.get('[data-testid="password"]').focus().type(password)
    cy.get('[data-testid="comfirmpass"]').focus().type(password)
    cy.get('[data-testid="submitRegister"]').should('be.visible').click()

    // Add Presentation Successfully
    cy.get('[data-testid="addNew"]').should('be.visible').click()
    cy.get('[data-testid="title"]').focus().type('New Presentation')
    cy.get('[data-testid="submit"]').should('be.visible').click()
    cy.get('[data-testid="pre"]').should('be.visible').first().click()

    // Updates Thumbnail and title
    cy.get('[data-testid="editThumbnail"]').should('be.visible').click()
    cy.get('[data-testid="thumbnail-upload"]').attachFile('pic.png')
    cy.get('[data-test-id="submit"]').should('be.visible').click()
    cy.get('[data-testid="editbtn"]').should('be.visible').click()
    cy.get('[data-testid="editTitleInput"]').focus().type('Updated Presentation Title')
    cy.get('[data-testid="submitNewTitle"]').should('be.visible').click()

    //back to dashboard and create another presentation
    cy.get('[data-testid="backtodash"]').should('be.visible').click()
    cy.get('[data-testid="addNew"]').should('be.visible').click()
    cy.get('[data-testid="title"]').focus().type('New Presentation')
    cy.get('[data-testid="submit"]').should('be.visible').click()
    cy.get('[data-testid="pre"]').should('be.visible').eq(1).click()

    // delete presentation successfully
    cy.get('[data-testid="delpresentation"]').should('be.visible').click()
    cy.get('[data-testid="confirmdel"]').should('be.visible').click()

    // Add Slides Successfully
    cy.get('[data-testid="pre"]').should('be.visible').first().click()
    cy.get('[data-testid="addslide"]').should('be.visible').click()
    cy.get('[data-testid="addslide"]').should('be.visible').click()

    // Switch between successfully
    cy.get('[data-testid="goright"]').should('be.visible').click()
    cy.get('[data-testid="goright"]').should('be.visible').click()
    cy.get('[data-testid="goleft"]').should('be.visible').click()
    cy.get('[data-testid="goleft"]').should('be.visible').click()
    cy.get('[data-testid="goright"]').should('be.visible').click()

    // Logout successfully
    cy.get('[data-testid="logout"]').should('be.visible').click()

    // Login successfully
    cy.get('[data-testid="emailInput"]').focus().type(email)
    cy.get('[data-testid="passwordInput"]').focus().type(password)
    cy.get('[data-testid="submitLogin"]').should('be.visible').click()
  })
})

