"use client"

import React from "react";


const PaymentPage = () => {
  const flutterwaveLink = "YOUR_PAYMENT_LINK"; // replace with your Flutterwave link

  return (
    <div className="page">
      {/* <div className="card">
        <h1>Pay School Fees</h1>
        <p>
          Click the button below to make a secure payment for your child’s
          school fees via Flutterwave.
        </p>
        <a href={flutterwaveLink} target="_blank" rel="noopener noreferrer">
          <button className="mt-10 pay-button">Pay Now</button>
        </a>
      </div> */}
      <div className="card">
        <h2>Payment Details</h2>

        <div className="detail">
          <div className="label">Bank Name</div>
          <div className="value">Wema Bank Plc</div>
        </div>

        <div className="detail">
          <div className="label">Account Name</div>
          <div className="value">Standard Schools Moro</div>
        </div>

        <div className="detail">
          <div className="label">Account Number</div>
          <div className="value">0122763810</div>
        </div>

        <div className="detail">
          <div className="label">Narration</div>
          <div className="value">Payment for Dues</div>
        </div>
      </div>

     
    </div>
  );
};

export default PaymentPage;
