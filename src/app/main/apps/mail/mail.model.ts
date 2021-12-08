export class Mail
{
    uid: number;
    fetch_options:number;
    fetch_body:boolean;
    fetch_attachment:boolean;
    fetch_flags:boolean;
    msglist:number;
    msgn:number;
    header:string;
    header_info:string;
    raw_body:string;
    message_id:string;
    message_no:number;
    subject:string;
    references:string;
    date: {
      date: string,
      timezone_type: number,
      timezone: string
    };
    from: {
        personal: string,
        mailbox: string,
        host: string,
        mail: string,
        full: string
      }[];
    to: {
      personal: string,
      mailbox: string,
      host: string,
      mail: string,
      full: string
    }[];
    cc: any[];
    bcc: any[];
    reply_to: {
        personal: string,
        mailbox: string,
        host: string,
        mail: string,
        full: string
      }[];
    in_reply_to: string;
    sender:{
        personal: string,
        mailbox: string,
        host: string,
        mail: string,
        full: string
      }[];
    priority: number;
    bodies: {
     text: {
        type: string,
       content: string
     },
      html: {
        type: string,
        content: string
      }
    };
    attachments: any[];
    flags: any[]

    /**
     * Constructor
     *
     * @param mail
     */
    constructor(mail)
    {
        this.uid = mail.uid;
        this.fetch_options = mail.fetch_options;
        this.fetch_body = mail.fetch_body;
        this.fetch_attachment = mail.fetch_attachment;
        this.fetch_flags = mail.fetch_flags;
        this.msglist = mail.msglist;
        this.msgn = mail.msgn;
        this.header= mail.header;
        this.header_info = mail.header_info;
        this.raw_body = mail.raw_body;
        this.message_id = mail.message_id;
        this.message_no = mail.message_no;
        this.subject = mail.subject;
        this.references = mail.references;
        this.date = mail.date;
        this.from = mail.from;
        this.to = mail.to;
        this.cc = mail.cc;
        this.bcc = mail.bcc;
        this.reply_to = mail.reply_to;
        this.in_reply_to = mail.in_reply_to;
        this.sender = mail.sender;
        this.priority = mail.priority;
        this.bodies = mail.bodies;
        this.attachments = mail.attachments;
        this.flags = mail.flags;
    }

    /**
     * Toggle star
     */
    toggleStar(): void
    {
        //this.starred = !this.starred;
    }

    /**
     * Toggle important
     */
    toggleImportant(): void
    {
        //this.important = !this.important;
    }
}
