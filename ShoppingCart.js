/// <reference types = "cypress"/>

class ShoppingCart{
    itemCost(text1){
        let cost =""
        for(let i=0;i<text1.length;i++){
            if(text1[i]!="\n" && text1[i]!=" " && text1[i]!='$'){
                    cost+=text1[i]
            }
        }
        return Number(cost)
    }

    visitAndAddItem(path){
        cy.visit("https://sunilkumarvj.github.io/React-Snipcart-practice/#/")
        cy.wait(1000)
        cy.get(path).click()        // changed xpath to selector
        cy.wait(2000)
    }

    billForMultipleItems(val){
        let num = ""
        let sum = 0.00
        for(let i=0;i<val.length;i++){
            if(val[i]!="\n" && val[i]!="$" && val[i]!=" "){
                num += val[i]
            }
            else if(val[i]=="\n" && i>0){
                sum += Number(num)
                num=""
            }
        }
        return sum
    }

    matchWithBill(total){
        cy.get(".snipcart-cart-summary-fees__amount").invoke("text").then((bill) => {
            expect(bill).to.equal("$"+total+".00")        // checks item cost and bill
        })
    }

    // Not visible in test
    /*matchWithSubtotal(total){
        cy.get(".snipcart-cart-summary-fees > div:nth-child(1) > span:nth-child(1)").should("be.visible").contains("Subtotal")
        cy.get(".snipcart-cart-summary-fees > div:nth-child(1) > span:nth-child(2)").invoke("text").then((subtotal)=>{
            expect(subtotal).to.equal("$"+total+".00")
        })
    }*/ 

    increaseQuantity(path){
        cy.get(path).click()        // changed xpath to get
        cy.wait(1000)
    }

    decreaseQuantity(path){
        cy.get(path).click()        // changed xpath to get
        cy.wait(2000)
    }

    deleteItem(path){
        cy.get(path).click()
        cy.wait(2000)
    }

    checkoutDetailsFillUp(name,email,street,apt,city,country,state,pin){
        cy.get("#name").should("be.visible").type(name)
        cy.get("#email").should("be.visible").type(email)
        cy.get("#address1").should("be.visible").type(street)
        cy.get("#address2").should("be.visible").type(apt)
        cy.get("#city").should("be.visible").type(city)
        cy.get("div.snipcart-form__field:nth-child(3) div.snipcart-typeahead__content > select.snipcart-form__select").select(country).should("have.value","US")
        cy.wait(1000)
        cy.get(".snipcart-form__cell--large:nth-child(1) div.snipcart-typeahead__content > .snipcart-form__select").select(state).should("have.value","AZ")
        cy.wait(1000)
        cy.get("#postalCode").should("be.visible").type(pin)
    }
}

export default ShoppingCart