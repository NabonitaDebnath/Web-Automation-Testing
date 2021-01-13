/// <reference types = "cypress"/>

describe("TASuite" , () => {
    it("Testing the form in the site", () => {
        cy.visit("https://demoqa.com/")
        cy.get(".category-cards > div:nth-child(2) > div > .avatar > svg").should("be.visible").click() // click forms icon

        cy.url().should("include","forms")

        cy.get(".accordion > div:nth-child(2) > span > div").should("be.visible").click().click()
        cy.get(".accordion > div:nth-child(2) > div.element-list > ul >li").should("be.visible").click()    // click the practice form

        cy.get(".practice-form-wrapper > h5").should("be.visible").contains(/[Student Registration Form]*\w+/)  // verify form title

        cy.get("#userForm > div > div").should("be.visible")        // check all the element's visibility

        for(let i=1 ; i<=11 ; i++){
            cy.get('#userForm > div:nth-child('+i+') > div:nth-child(1)').contains(/\w+/)       // check all label has a value
        }

        // storing all details in an object
        let deets = {
            fName : "Nabonita",
            lName : "Debnath",
            email : "nabonitadebnath22@yhaoo.com",
            gender : "Female",
            pNumber : "8837351733",
            dob : {
                month : "January",
                year : "1999",
                date : "22"
            },
            subjects : ["Computer Science" , "Chemistry" , "Physics"],
            hobby : "3",
            picture : "Photo.jpg",
            address : "Khayerpur - 799008",
            state : "NCR",
            city : "Delhi"
        }
        let len = Object.keys(deets).length                 // getting total length

        cy.get("#firstName").type(deets.fName)                           // type name    
        cy.get("#lastName").type(deets.lName)

        cy.get("#userEmail").type(deets.email)        // type email

        cy.get('.custom-control > input[value='+deets.gender+']').should("not.be.checked").check({force:true})      // select "Female" option
        
        cy.get("#userNumber").type(deets.pNumber)                        // type number

        cy.get("#dateOfBirthInput").click()                             // select dob
        cy.get(".react-datepicker__month-select").select(deets.dob.month)
        cy.get(".react-datepicker__year-select").select(deets.dob.year)
        cy.get(".react-datepicker__day").contains(deets.dob.date).click()

        for(let i=0 ; i<deets.subjects.length; i++){
            cy.get(".subjects-auto-complete__control").click().type(deets.subjects[i]+"{enter}")     // type subjects
        }
        
        cy.get("#hobbiesWrapper > div:nth-child(2) >div > #hobbies-checkbox-"+deets.hobby+"").should("not.be.checked").check({force:true})        // select hobbies

        cy.get("#uploadPicture").click().attachFile(deets.picture)       // upload picture

        cy.get("#currentAddress").type(deets.address)            // type address

        cy.get("#state").click().type(""+deets.state+"{enter}")                      // select state

        cy.get("#city").click().type(""+deets.city+"{enter}")                      // select city

        cy.get("#submit").click()                                       // click submit button

        // form verification after submission
        cy.get("#example-modal-sizes-title-lg").should("be.visible").contains(/\w+/)

        cy.get("tbody > tr:nth-child(1) > td:nth-child(2)").contains(deets.fName+" "+deets.lName)
        cy.get("tbody > tr:nth-child(2) > td:nth-child(2)").contains(deets.email)
        cy.get("tbody > tr:nth-child(3) > td:nth-child(2)").contains(deets.gender)
        cy.get("tbody > tr:nth-child(4) > td:nth-child(2)").contains(deets.pNumber)
        cy.get("tbody > tr:nth-child(5) > td:nth-child(2)").contains(deets.dob.date+" "+deets.dob.month+","+deets.dob.year)
        let sub = ""
        for(let i=0 ; i<deets.subjects.length ; i++){
            let val = deets.subjects[i]
            if(i>0){
                sub = sub + ", "+val
            }
            else{
                sub+=val
            }
        }
        cy.get("tbody > tr:nth-child(6) > td:nth-child(2)").contains(sub)
        cy.get("tbody > tr:nth-child(7) > td:nth-child(2)").contains("Music")
        cy.get("tbody > tr:nth-child(8) > td:nth-child(2)").contains(deets.picture)
        cy.get("tbody > tr:nth-child(9) > td:nth-child(2)").contains(deets.address)
        cy.get("tbody > tr:nth-child(10) > td:nth-child(2)").contains(deets.state+" "+deets.city)

        cy.get("#closeLargeModal").scrollIntoView().should("be.visible").click()         // click close button
    })
})