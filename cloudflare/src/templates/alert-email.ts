import { formatPastDate } from "../utils/format-past-date";

export function AlertEmail({
  name,
  lastPing,
}: {
  name: string;
  lastPing: Date;
}) {
  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html dir="ltr" lang="en">
      <head>
        <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
        <meta name="x-apple-disable-message-reformatting" />
        <style></style>
        <style>
          @font-face {
            font-family: "Roboto";
            font-style: normal;
            font-weight: 400;
            mso-font-alt: "Verdana";
            src: url(https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2)
              format("woff2");
          }

          * {
            font-family: "Roboto", Verdana;
          }
        </style>
      </head>
      <body style="background-color: rgb(255, 255, 255)">
        <!--$--><!--html--><!--head--><!--body-->
        <table
          border="0"
          width="100%"
          cellpadding="0"
          cellspacing="0"
          role="presentation"
          align="center"
        >
          <tbody>
            <tr>
              <td style="background-color: rgb(255, 255, 255)">
                <table
                  align="center"
                  width="100%"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  role="presentation"
                  style="max-width: 37.5em"
                >
                  <tbody>
                    <tr style="width: 100%">
                      <td>
                        <table
                          align="center"
                          width="100%"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          role="presentation"
                          class="border-gray"
                          style="
                            border-style: solid;
                            border-width: 1px;
                            border-radius: 0.25rem;
                            overflow: hidden;
                          "
                        >
                          <tbody>
                            <tr>
                              <td>
                                <table
                                  align="center"
                                  width="100%"
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  role="presentation"
                                  style="padding: 1.25rem; padding-bottom: 0rem"
                                >
                                  <tbody style="width: 100%">
                                    <tr style="width: 100%">
                                      <td data-id="__react-email-column">
                                        <h1
                                          style="
                                            font-size: 32px;
                                            font-weight: 700;
                                            text-align: center;
                                          "
                                        >
                                          Hi,
                                        </h1>
                                        <h2
                                          style="
                                            font-size: 26px;
                                            font-weight: 700;
                                            text-align: center;
                                          "
                                        >
                                          Someone you know has not shown a sign of
                                          life for a while
                                        </h2>
                                        <h2
                                          style="
                                            font-size: 26px;
                                            font-weight: 700;
                                            text-align: center;
                                            color: rgb(51, 200, 158);
                                          "
                                        >
                                          &quot;${name}&quot;
                                        </h2>
                                        <h3
                                          style="
                                            font-size: 26px;
                                            font-weight: 700;
                                            text-align: center;
                                          "
                                        >
                                          You may check on them it you can
                                        </h3>
                                        <p
                                          style="
                                            font-size: 1rem;
                                            line-height: 1.5;
                                            margin-top: 16px;
                                            margin-bottom: 16px;
                                          "
                                        >
                                          <b>Last activity: </b>${formatPastDate(lastPing)}
                                        </p>
                                        <p
                                          style="
                                            font-size: 1rem;
                                            line-height: 1.5;
                                            margin-top: 16px;
                                            margin-bottom: 16px;
                                          "
                                        >
                                          By reciving this message means that the
                                          person in question has chosen you as an
                                          emergency contact in case something
                                          happens to them
                                        </p>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <p
                          style="
                            font-size: 0.75rem;
                            line-height: 24px;
                            text-align: center;
                            color: rgb(0, 0, 0, 70%);
                            margin-top: 16px;
                            margin-bottom: 16px;
                          "
                        >
                          © ${new Date().getFullYear()} | Life Ping
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
        <!--/$-->
      </body>
    </html>
  `;
}
