/// <reference types = "cypress"/>

import ShoppingCart from '../PageObjects/ShoppingCart'

// Shopping cart home page
describe("Shopping Cart Suite" , () => {
    it("Visit site and verify url" , () => {
        cy.visit("https://sunilkumarvj.github.io/React-Snipcart-practice/#/")
        cy.url().should("include","https://sunilkumarvj.github.io/React-Snipcart-practice/#/")
        cy.title().should("eq","React App")
        cy.wait(3000)
    })

    it("Verify heading", () => {
        cy.get("h1").should("be.visible").contains(/[Sunil Shopping Cart]*\w+/)
    })

    it("Verify images" , () => {
        cy.get(".album > img").should("be.visible")
    })

    it("Verify contents" , () => {
        cy.get(".item2 > div > .desc").invoke("text").then((val) => {
            let len = val.match(/Add to cart/g).length
            cy.log(len)

            // verify number of images and contents
            cy.get(".album").should("have.length",len)
            cy.get(".desc > .title").should("be.visible").should("have.length",len).contains(/\w+/)
            cy.get(".desc > .Id").should("be.visible").should("have.length",len).contains(/\w+/)
            cy.get(".desc > .Maker").should("be.visible").should("have.length",len).contains(/\w+/)
            cy.get(".desc > .Description").should("be.visible").should("have.length",len).contains(/\w+/)
            cy.get(".desc > p:nth-child(5)").should("be.visible").should("have.length",len).contains("Url").contains(/\w+/)
            cy.get(".desc > button").should("be.visible").should("have.length",len).contains("Add to cart")
        })    
    })
})

// Add and test using 1 item
describe("Add 1 item to Cart Suite" , () => {
    it("Visit site and add item" , () => {
        const cart =  new ShoppingCart()
        cart.visitAndAddItem("div.desc:nth-child(1) > button.buy-button.snipcart-add-item:nth-child(7)")
    })

    it("Cart Summary adding 1 product - quantity 1",() => {         
        const cart = new ShoppingCart()

        //Verify all the contents are visible in proper format
        cy.title().should("eq","React App")
        cy.get(".snipcart-item-line__header > figure").should("be.visible")
        cy.get(".snipcart-item-line__header > h2").should("be.visible").contains(/\w+/)
        cy.get(".snipcart-item-line__header > div > button").should("be.visible")
        

        cy.get(".snipcart-item-custom-fields > div > label").should("be.visible").contains(/[Frame color]*\w+/)
        cy.get(".snipcart-item-custom-fields > div > div > select").should("be.visible")

        cy.get(".snipcart-item-quantity > label").should("be.visible").contains("Quantity")
        cy.get(".snipcart-item-quantity > div > div > button").should("be.visible")
        cy.get(".snipcart-item-quantity > div > div > span").should("be.visible").contains(/\d+/)

        cy.get(".snipcart-item-quantity__total-price").should("be.visible").contains(/(\$)[0-9]*(.)[0-9]*/) // add a brace here

        cy.get(".snipcart-discount-box__button").should("be.visible").contains(/\w+/)
        cy.get(".snipcart-cart-summary-fees__title").should("be.visible").contains("Total")
        cy.get(".snipcart-cart-summary-fees__amount").should("be.visible").contains(/(\$)[0-9]*(.)[0-9]*/) // add a brace here

        cy.get(".snipcart-cart-summary-fees__notice").should("be.visible").contains(/\w+(.)$/)
        cy.get("footer > button > span > .snipcart-cart-button__content").should("be.visible").contains("Checkout")

        cy.get(".snipcart-featured-payment-methods__link").scrollIntoView().should("be.visible").contains("Secured by Snipcart")
        cy.get(".snipcart-featured-payment-methods__list > li").should("be.visible")

        // Checks if the item amount and bill amount are equal
        cy.get(".snipcart-item-quantity__total-price").invoke("text").then((text1) => {
            let cost =cart.itemCost(text1)
            cart.matchWithBill(cost)
        })
    })

    // Increasing product quantity and equating the cost and bill
    it("Cart with 1 product multiple quantity" , () => {
        const cart = new ShoppingCart()

        cy.get('.snipcart-item-quantity > div > div > button > svg[title = "Increment quantity"]').click()
        cy.wait(3000)
        cy.get(".snipcart-item-quantity > div > div > span").invoke("text").then((val) => {
            const quant = Number(val)
            const fixed_rate = 10.00

            cy.get(".snipcart-item-quantity__total-price").invoke("text").then((text1) => {
                const cost = cart.itemCost(text1)
                const actual_cost = quant * fixed_rate
                expect(cost).to.be.equal(actual_cost)   // checks the item cost

                cart.matchWithBill(cost)
            })
        })       
    })
})

// Add and test using multipe items
describe("Add multiple item to cart" , () => {
    // Increasing item and quantity and equating their total sum to the bill
    it("Increase Quantity & verify bill" , () =>{
        const cart = new ShoppingCart()

        cart.visitAndAddItem("div.desc:nth-child(1) > button.buy-button.snipcart-add-item:nth-child(7)")
        cy.get(".snipcart-modal__close-title").should("be.visible").click()
        cy.wait(1000)
        cart.visitAndAddItem("div.desc:nth-child(2) > button.buy-button.snipcart-add-item:nth-child(7)")
        cy.wait(2000)
        cart.increaseQuantity("ul.snipcart-item-list > li:nth-child(1) > div.snipcart-item-line__product > div:nth-child(2) > div  > div.snipcart-item-line__variants > div.snipcart-item-quantity > div:nth-child(2) > div > button:nth-child(3)")
        cy.wait(1000)
        cart.increaseQuantity("ul.snipcart-item-list > li:nth-child(2) > div.snipcart-item-line__product > div:nth-child(2) > div  > div.snipcart-item-line__variants > div.snipcart-item-quantity > div:nth-child(2) > div > button:nth-child(3)")

        cy.get(".snipcart-item-quantity__total-price").invoke("text").then((val) => {
            const total = cart.billForMultipleItems(val)
            cart.matchWithBill(total) 
            //cart.matchWithSubtotal(total)     // subtotal not visible in test
        })
        cy.wait(1000)
    })

    // Decrease quantity of product and equating the amount and bill
    it("Decrease quantity & verify bill " , () => {
        const cart = new ShoppingCart()
        cart.decreaseQuantity("ul.snipcart-item-list > li:nth-child(2) > div.snipcart-item-line__product > div:nth-child(2) > div  > div.snipcart-item-line__variants > div.snipcart-item-quantity > div:nth-child(2) > div > button:nth-child(1)")
        
        cy.get(".snipcart-item-quantity__total-price").invoke("text").then((val) => {
            const total = cart.billForMultipleItems(val)
            cart.matchWithBill(total)  
        })
    })

    //Verify the total quantity with the quantity in cart
    it("Verify the quantity",() => {
        cy.get(".snipcart-item-quantity__quantity > .snipcart__font--secondary").invoke("text").then((val) => {
            let quant = ""
            let tot_quant = 0
            for(let i=0;i<val.length;i++){
                if(val[i]!="\n"){
                    quant+=val[i]
                }
                else if(val[i]=="\n"){
                    tot_quant += Number(quant)
                    quant=""
                }
            }
            cy.get(".snipcart-cart-header__option").invoke("text").then((val) => {
                expect(Number(val)).to.equal(tot_quant)
            })
        })
    })
})

// Test item deletion
describe("Delete Cart Item" , () => {
    // Removal of one product 
    it("Delete and verify bill" , () => {
        const cart = new ShoppingCart()

        cart.deleteItem("#snipcart > div > div > div.snipcart-layout__content > section > ul > li:nth-child(1) > div > div.snipcart-item-line__header > div > button")
        
        cy.get(".snipcart-item-quantity__total-price").invoke("text").then((val) => {
            const total = cart.billForMultipleItems(val)
            cart.matchWithBill(total)  
        })
    })

    // Removal of all products and verify cart to be empty
    it("Delete all , check cart & go back to store",() => {
        const cart = new ShoppingCart()

        cart.deleteItem("#snipcart > div > div > div.snipcart-layout__content > section > ul > li:nth-child(1) > div > div.snipcart-item-line__header > div > button")
        cy.get(".snipcart-empty-cart__title").should("be.visible").contains(/[Your cart is empty.]*\w+/)
        cy.wait(2000)
        cy.get(".snipcart-cart-button__content").click()
        cy.url().should("include","https://sunilkumarvj.github.io/React-Snipcart-practice/#/")
    })
})

// Test the checkout process
describe("Checkout Process" , () => {
    it("Visit site,add item" , () => { 
        const cart =  new ShoppingCart()
        cy.wait(2000)
        cart.visitAndAddItem("div.desc:nth-child(1) > button.buy-button.snipcart-add-item:nth-child(7)")
        cy.wait(2000)
        cart.increaseQuantity("ul.snipcart-item-list > li:nth-child(1) > div.snipcart-item-line__product > div:nth-child(2) > div  > div.snipcart-item-line__variants > div.snipcart-item-quantity > div:nth-child(2) > div > button:nth-child(3)")
    })

    it("Promo Code , apply and cancel" , () => {
        cy.get(".snipcart-discount-box__button").click()
        cy.wait(1000)
        cy.get(".snipcart-discount-box__form-container").type("FREEDEL")
        cy.get(".snipcart-discount-box__submit").click()
        cy.get(".snipcart-error-message").should("be.visible").contains("This promo code isn't valid")

        cy.get(".snipcart-discount-box__cancel").click()
        cy.wait(1000)
    })

    it("Checkout and proceed" , () => {
        const cart =  new ShoppingCart()
        
        cy.get(".snipcart-cart-summary-fees__amount").invoke("text").then((val) => {
            let cart_bill = cart.itemCost(val)

            cy.get(".snipcart-cart-button__content").click()
            cy.wait(1000)

            // check if bill amount from previous page is equal to the amount in payment page
            cy.get(".snipcart-modal__header-summary-title > span").should("be.visible").invoke("text").then((bill) =>{
                let checkout_bill = cart.itemCost(bill)
                expect(checkout_bill).to.equal(cart_bill)
            })
        })
    })

    it("Checkout Page Billing" , () => {
        const cart = new ShoppingCart()

        cy.get(".snipcart__font--subtitle").should("be.visible").contains("Billing")

        // check all the fields to be visible and contain the correct field names
        cy.get(".snipcart-form__label").should("be.visible").contains("Full name")
        cy.get(".snipcart-form__label").should("be.visible").contains("Email")
        cy.get(".snipcart-form__label").should("be.visible").contains("Street address")
        cy.get(".snipcart-form__label").should("be.visible").contains("Apt/Suite")
        cy.get(".snipcart-form__label").should("be.visible").contains("City")
        cy.get(".snipcart-form__label").should("be.visible").contains("Country")
        cy.get(".snipcart-form__label").should("be.visible").contains("Province/State")
        cy.get(".snipcart-form__label").should("be.visible").contains("Postal/ZIP code")

        // fill in all the details
        cart.checkoutDetailsFillUp("Nabonita Debnath","nabonitadebnath22@yahoo.com","Khayerpur","2(A)","Agartala","United States","Arizona","799008")

        cy.get(".snipcart-cart-button__content").should("be.visible").contains("Continue to payment").click()
    })

    it("Verify details after clicking 'continue to payment'" , () => {
        // verify the billing details
        cy.get(".snipcart-billing-completed__information").should("be.visible").contains(/\w+/)

        // edit details using 'Edit' and changing the 'state'
        cy.get(".snipcart__actions--link").should("be.visible").click()
        cy.get(".snipcart-form__cell--large:nth-child(1) div.snipcart-typeahead__content > .snipcart-form__select").select("California")
        cy.wait(1000)
        cy.get(".snipcart-cart-button__content").click()
        cy.wait(2000)
    })

    it("Payment",() => {
        cy.wait(2000)
        cy.get(".snipcart-cart-button").should("be.visible").click()
        cy.wait(3000)
        cy.get(".snipcart-flash-message__title").should("be.visible").contains("Unable to process payment")

        /*cy.get("fieldset > div > div > div").within(($fieldset) => {
            cy.get("#card-number").type("4242424242424242")
        })
        cy.xpath("//body/div[@id='snipcart']/div[1]/div[1]/div[2]/div[1]/div[1]/div[1]/div[1]/div[1]/div[2]/div[1]/div[2]/span[1]").should("be.visible").type("4242424242424242")
        cy.xpath("//body/div[@id='snipcart']/div[1]/div[1]/div[2]/div[1]/div[1]/div[1]/div[1]/div[1]/div[2]/div[1]/div[2]/span[1]").should("be.visible").type("0223")
        
        cy.get("iframe").then(($iframe) => {
            const doc = $iframe.contents()
            cy.log(doc)
            doc.find("#card-number").type("4242424242424242")
            doc.find("expiry-date").type("0225")
            doc.find("#cvv").type("123")
        })
        cy.get(".snipcart-payment-form").iframe().find('input[id="card-number"]').type("4242424242424242")
        */
    })

    it("Back to home page" , () => {
        cy.wait(2000)
        cy.get(".snipcart-modal__close-title").click()
    })
})