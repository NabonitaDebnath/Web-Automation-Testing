/// <reference types = "cypress"/>

import Gatsby from '../PageObjects/Gatsby'

// Test Suite for Home Page
describe("Gatsby Home Page Test Suite", () => {
    
    it("Visit the site" , () =>{
        const gat = new Gatsby()

        gat.visitHomePage()
        gat.verifyHomePage()
    })

    it("Check element's presence" , () => {
        const gat = new Gatsby()
        gat.checkThePageHeader()   
    })

    it("Check the big image" , () => {
        cy.get("#gatsby-focus-wrapper > div > img").should("be.visible").should("have.class","page2img")
    })

    it("Check the decription section",() =>{
        const gat = new Gatsby()
        
        gat.checkContent("div.enemi > h2.h31","h31")
        cy.get("div.enemi > p").should("be.visible").contains(/^\w+/)
        gat.checkContent("div.enemi > h2.Buy","Buy")
        
    })

    it("Check total number of products" , () => {

        // got the total product number dynamically
        cy.get(".mainprodp > div").invoke("text").then((val) => {
            let len = (val.match(/Add Item/g)).length

            cy.get(".mainprodp > div.s1").should("be.visible").should("have.length",len);
            cy.get(".mainprodp > .s1 > img.imgbeers").should("be.visible").should("have.length",len)

            cy.get(".mainprodp > .s1 > div.bttn").should("have.length",len).should("be.visible").contains("Add Item")

            cy.get(".mainprodp > .s1 > .desc > .title").should("be.visible").should("have.length",len).contains(/^Title:\s\w+/)
            cy.get(".mainprodp > .s1 > .desc > .price").should("be.visible").should("have.length",len).contains(/^Price:\s₹\s\d+$/)
            cy.get(".mainprodp > .s1 > .desc > .description").should("be.visible").should("have.length",len).contains(/^Description:\s\w/)
            
        })
    })

    it("Add item to cart and verify with alert" , () => {
        cy.on("window:alert" , (str) => {
            expect(str).to.equal("added to the cart")
        })
        cy.get(".mainprodp > .s1 > .bttn > button").click({multiple : true , force : true})
        
    })

})

// Test Suite for Beer Store Page
describe("Gatsby Beer Store Suite",() => {
    
    it("Visit the site and go to beer store" , () =>{
        const gat = new Gatsby()
        
        gat.visitHomePage()
        gat.verifyHomePage()
        cy.wait(2000)

        cy.get(".header > .logo > a > img").click()
        cy.url().should("include","https://sunilkumarvj.github.io/gatsby-demo/")
        cy.title().should("eq","")
    })

    it("Check the header part" , () => {
        const gat = new Gatsby()
        gat.checkThePageHeader()
    })

    it("Check the main image" , () => {
        cy.wait(3000)
        cy.get(".mainimg > div > img").should("be.visible").and("have.class","suvani")
    })

    it("Check the contents" , () => {
        cy.get("p.quote").should("be.visible").contains(/\w+/)

        cy.get("h2.h21").should("be.visible").contains(/[Did You Know?]*\w+/)
        cy.get(".img3 > div > p").should("be.visible").contains(/\w+/)
        cy.get(".img3 > div > .expimg").should("be.visible")

        cy.get(".h22").should("be.visible").contains(/[Have Fun With Beers...]*\w+/)
        cy.get(".div > div > img.img2").should("be.visible")
        cy.get(".div > .desc1 > p").should("be.visible").contains(/\w+/)
    })

    it("Check the end part and click", () => {
        cy.get(".suni").should("be.visible").contains(/[Beer Products for Beer Lovers]*\w+/)
        cy.get(".clickHere").should("be.visible")

        //cy.get(".bodyCont > a >div > img.bottle").should("be.visible").trigger("mouseover").click()
        //cy.get("p.bp").should("be.visible").contains("Click on Bottle for Beer Products")
        cy.get(".bodyCont > a >div > img.bottle").should("be.visible").click()

        cy.url().should("include","sunilkumarvj.github.io/gatsby-demo/Products")
    })
})


//Test Suite for Beer Products Page
describe("Beer Products Suite" , () => {
    it("Visit the site and verify details",() => {
        const gat = new Gatsby()

        gat.visitHomePage()
        gat.verifyHomePage()
        cy.wait(2000)
    })

    it("Click on Beer Products and check the url to be same" , () => {
        cy.get(".ytube > a").should("be.visible").contains(/[Beer Products]*\w+/).click()
        cy.url().should("include","https://sunilkumarvj.github.io/gatsby-demo/Products")
    })
})

//Test Suite for Beer Lovers Page
describe("Beer Lovers Suite", () => {
    it("Visit the site and verify details",() => {
        const gat = new Gatsby()

        gat.visitHomePage()
        gat.verifyHomePage()
        cy.wait(2000)
    })

    it("Click on Beer Lover and verify" , () => {
        const gat = new Gatsby()

        cy.get(".home > a").click()
        cy.url().should("include","https://sunilkumarvj.github.io/gatsby-demo/Blovers")
        cy.title().should("eq","")
        gat.checkThePageHeader()
    })

    it("Check the image and content in it" , () => {
        cy.get(".kmainimg").should("be.visible")
        cy.get(".text1").should("be.visible").contains(/\w+/)
    })

    it("Check title and food images",() => {
        cy.get(".center").should("be.visible").contains(/[Beer & Food Pairing]*\w+/)

        cy.get(".mainwhole > div.mine").invoke("text").then((val) => {
            let len = (val.match(/Learn More../g)).length
            cy.get(".mainwhole > .mine").should("be.visible").should("have.length",len)  // dynamic length
        })

        cy.get(".mainwhole > .mine > img").should("be.visible")
        cy.get(".mainwhole > .mine > div > strong").should("be.visible").contains(/\w+/)
        cy.get(".mainwhole > .mine > .content1").should("be.visible").contains(/\w+/) 
        cy.get(".mainwhole > .mine > div > a").should("be.visible").contains(/[Learn More..]*\w+/)
    })

    it("Check for all the images " ,() => {
        const gat = new Gatsby()
        
        // get the products length dynamically
        cy.get(".mainwhole > div.mine").invoke("text").then((val) => {
            let len = (val.match(/Learn More../g)).length
            cy.log(len)

            for(let i = 1 ;i <=len; i++){
                cy.get(".mainwhole > div.mine:nth-child("+i+") > div > strong").invoke("text").then((val) => {
                    //let str = val.toLowerCase().replace('&','-').replace(' ','-')
                    let str = val.toLowerCase().replace('&','-')
                    let pos = str.indexOf(' ')
                    let str1 = str.slice(0,pos)
                    //cy.log(str1)
                    let path = ".mainwhole > div.mine:nth-child("+i+") > div > a > .black"      // changed xpath
                    gat.clickImageLink(path,str1)
                })
            }
        })
    })
})


//Test Suite for About Us Page
describe("About Us Suite", () => {
    it("Visit the site , verify and click on About Us",() => {
        const gat = new Gatsby()

        gat.visitHomePage()
        gat.verifyHomePage()
        gat.checkThePageHeader()

        cy.get(".quot > a").click()
    })

    it("Verify the new page url",() => {
        cy.url().should("include","https://en.wikipedia.org/wiki/The_Beer_Store")
    })

    it("Back to Home Page" , () => {
        cy.wait(2000)
        cy.go(-1)
    })
})


//Test Suite to check page scroll
describe("Scroll Suite" , () => {
    it("Scroll Home Page",() => {
        const gat =  new Gatsby()

        gat.visitHomePage()

        cy.scrollTo("bottom")
        cy.wait(3000)
        cy.scrollTo('right')
        cy.wait(2000)
    })

    it("Scroll Beer Store Page" , () => {
        cy.get(".logo > a > img").click()
        cy.wait(3000)
        cy.scrollTo("bottom")
        cy.wait(3000)
        cy.scrollTo('right')
        cy.wait(2000)
    })

    it("Scroll Beer Lovers Page" , () => {
        cy.get(".home > a").click()
        cy.wait(3000)
        cy.scrollTo("bottom")
        cy.wait(3000)
        cy.scrollTo('right')
    })
})