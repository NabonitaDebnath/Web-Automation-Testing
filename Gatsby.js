/// <reference types = "cypress"/>


class Gatsby{
    visitHomePage(){
        cy.visit("https://sunilkumarvj.github.io/gatsby-demo/Products");
    }

    verifyHomePage(){
        cy.url().should("include","https://sunilkumarvj.github.io/gatsby-demo/Products");
        cy.title().should('eq',"")
    }

    checkThePageHeader(){
        cy.get("h1.beer").should("be.visible").contains(/[Beer]*\w+/); //Beer Store
        cy.get(".header > div").should("be.visible").should("have.class","logo");
        cy.get(".header > .ytube").should("be.visible").contains(/[Beer]*\w+/);       //Beer Products
        cy.get(".header > .home").should("be.visible").contains(/[Beer]*\w+/);      // "Beer Lovers"
        cy.get(".header > .quot").should("be.visible").contains(/\w+/);        // About Us
        cy.get(".header > div").should("be.visible").should("have.class","gif");
    }

    clickImageLink(path,name){
        cy.get(path).click()            // changed xpath
        cy.wait(2000)
        cy.url().should("include",name)
        cy.go(-1)
        
        
    }

    checkContent(path,cls){
        cy.get(path).invoke("text").then((val) => {
            const content = val
            cy.get("div.enemi > h2").should("be.visible").should("have.class",cls).contains(content)
        })
    }
}

export default Gatsby