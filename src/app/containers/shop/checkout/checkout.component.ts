import { Component, OnInit, AfterViewChecked } from '@angular/core';

declare var $:any; // want to use jQuery here
declare var paypal:any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})

export class CheckoutComponent implements OnInit, AfterViewChecked {

  constructor() { }

  ngOnInit() {
  }

  private didRenderPaypal: boolean = false;

  ngAfterViewChecked() {
    this.configurePaypal();
  }
  
  configurePaypal() {
    if (!this.didRenderPaypal) {

      var userId = 2;

      this.loadPaypalScript().then(() => {
        paypal.Button.render({
            env: 'sandbox', // sandbox | production
            // Create a PayPal app: https://developer.paypal.com/developer/applications/create
            client: {
              sandbox: 'access_token$sandbox$ncyzjdwmprfz7w6s$670e8d2b326d2edf1a7c07382dfe0822',
              // production: environment.services.paypal.clientId
            },
            // Show the buyer a 'Pay Now' button in the checkout flow
            commit: true,

            // payment() is called when the button is clicked
            payment: function(data, actions) {

              // Make a call to the REST api to create the payment
              return actions.payment.create({
                payment: {
                  transactions: [
                    {
                      amount: {
                        total: '12.00',
                        currency: 'USD',
                        // details: {
                        //   subtotal: $('#subtotal').val(),
                        //   tax: $('#tax').val(),
                        // }
                      },
                      // custom: JSON.stringify({ // YOU CAN ADD CUSTOM DATA HERE
                      //   user_id: userId,
                      //   qty: $('#qty').val()
                      // })
                    }
                  ]
                }
              });
            },

            // onAuthorize() is called when the buyer approves the payment
            onAuthorize: function(data, actions) {
              // Make a call to the REST api to execute the payment
              return actions.payment.execute().then(function() {
                //console.log(data);
                window.alert('Payment Complete!');
                // need order information
                // current user information 
                // orcasshop information
                console.log('send email here');
              });
            }

        }, '#paypal-button-container');
      });
    }
  }

  private loadPaypalScript(): Promise<any> {
      this.didRenderPaypal = true;
      return new Promise((resolve, reject) => {
          const scriptElement = document.createElement('script');
          scriptElement.src = 'https://www.paypalobjects.com/api/checkout.js';
          scriptElement.onload = resolve;
          document.body.appendChild(scriptElement);
      });
  }
}