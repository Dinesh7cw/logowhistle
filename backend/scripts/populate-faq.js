const data = [
  {
    "q": "In general, what are the various phases in the whole custom logo designing process?",
    "a": "<p>The custom logo design process usually starts with the communication phase where a conversation (in a mode suitable for both parties) between the client and the designer would be arranged. This is then followed by the design phase and at the end of it, the client will be provided with the first draft of the complete logo.</p>\n<p>In case of revisions, the client can ask for iterations of modification to the design until they get the desired output. If both parties are satisfied with the custom logo design output , the finishing processes will be initiated and the logo will be officially delivered to the client.</p>"
  },
  {
    "q": "What is the average turnaround time to get the custom logo design job done?",
    "a": "<p>Ideally, when the client has the clear picture of what they want, the entire process takes around 3-4 Days (Check Pricing Page for duration of each Package). Clear communication is the key to faster and better results so we would request the clients to help us in understanding the way forward.</p>"
  },
  {
    "q": "Is it really true that you offer unlimited revisions for the logo design?",
    "a": "<p>Except for the basic package, we offer unlimited revisions until the final delivery of the logo. No additional or hidden charges!</p>"
  },
  {
    "q": "What if I want some modifications once the logo has been delivered and launched?",
    "a": "<p>Our “unlimited revisions” offer will not be applicable for delivered logos because we are providing custom logo designs according to clients ideas. However, we can modify the logos with additional costs depending upon the work.</p>"
  },
  {
    "q": "How much will I be charged? Do you state price based on a package?",
    "a": "<p>In order to cater to all type of clients, we have developed 3 packages: Basic, Economic and Brand. The common thread for all the packages will be the superior quality of the final output as we believe that ever logo is unique, not just in its design but also the thought process that goes into it. If you are interested to know a rough estimate for your requirements, this will be the place to start.</p>"
  },
  {
    "q": "When and how should the payment be made?",
    "a": "<p>We always prefer to receive the payment upfront- before the design phase. But don’t worry! We always deliver better than we promise. Since we cater to custom logo design requests from all over the world, we accept USD for payment and we accept them via PayPal.</p>"
  },
  {
    "q": "How will the logos be delivered?",
    "a": "<p>Once the final touches are done, we will share the link to download the logo in email. The finished custom logo designs will be in one of these popular formats: EPS, PNG, JPG,AI, Source CorelDraw File. We would be glad to resize or reformat it as per your specifications.</p>"
  },
  {
    "q": "What if I am not satisfied with your work even after umpteen iterations?",
    "a": "<p>We would be sorry for letting you down and would try every avenue possible to make you happy. But if it is not working for you still, we will offer a 100% refund. Your satisfaction matters the most to us!</p>"
  },
  {
    "q": "Tell me about your copyright policies.",
    "a": "<p>Being a part of the designers’ ecosystem, we understand the importance of copyrights in our business. We assure you of a 100% unique design that will be just for your brand. Once the logo designs has been delivered, you will be entitled with the complete ownership of that final product.</p>\n<p>We would request you to allow us to showcase those designs in our portfolio (under your name) for our brand building purposes. However, we will still be the owners of the design ideas that were rejected by you during the process.</p>"
  },
  {
    "q": "Is my business information safe with you?",
    "a": "<p>Maintaining high standards of business ethics is of utmost importance to us. We assure that any type of business information that you share with us during our course of work will be treated with dignity and will not be used or shared with anyone else.</p>"
  },
  {
    "q": "I am impressed with your works. Do you offer any other web-related services?",
    "a": "<p>Yes! We do. We offer services like website design, redesign, development, CMS, Social Media marketing etc. under our parent concern <a href=\"https://colorwhistle.com/\" target=\"_blank\" rel=\"noopener\">ColorWhistle.</a></p>\n<p>Our group operates from the city of Coimbatore in India and we serve clients from all over the world. Join our family and we will assure you that you need not look anywhere further for web-related services, ever!</p>"
  }
];

const STRAPI_URL = 'http://127.0.0.1:1337';
const axios = require('axios');

async function populateFaq() {
  try {
    console.log('Populating faq-page...');
    // Create faq-page single type content
    try {
      await axios.put(`${STRAPI_URL}/api/faq-page`, {
        data: {
          heroHeadline: 'Logo Design FAQs',
          heroSubheadline: 'Get the Answers You Need Before You Start Your Project'
        }
      });
    } catch (e) {
      if (e.response && e.response.status === 404) {
        // If put fails because it doesn't exist yet, do a POST or maybe it needs to be initialized. Single types sometimes need to be created first or PUT works if initialized.
        // Actually, for a single type, we might not need to pre-create, but typically PUT is fine once the server creates it. Let's try POST if PUT fails.
      }
      console.log('Update faq-page error, maybe type is not synced yet. Trying POST...');
      try {
        await axios.post(`${STRAPI_URL}/api/faq-page`, {
          data: {
            heroHeadline: 'Logo Design FAQs',
            heroSubheadline: 'Get the Answers You Need Before You Start Your Project'
          }
        });
      } catch (err) {
        console.error('Failed to populate faq-page:', err.response ? err.response.data : err.message);
      }
    }

    console.log('Populating faq-items...');
    // Clear out existing faq items first if any (optional, but let's assume it's empty)
    
    // Add all faq items
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      try {
        await axios.post(`${STRAPI_URL}/api/faq-items`, {
          data: {
            question: item.q,
            answer: item.a,
            displayOrder: i
          }
        });
        console.log(`Added FAQ item ${i + 1}/${data.length}`);
      } catch (err) {
        console.error(`Failed to add item ${i}:`, err.response ? err.response.data : err.message);
      }
    }
    console.log('Done!');
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
}

populateFaq();
