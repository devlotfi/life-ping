import {
  Body,
  Button,
  Column,
  Container,
  Font,
  Head,
  Heading,
  Html,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

export default function AlertEmail() {
  return (
    <Html>
      <Tailwind>
        <Head>
          <Font
            fontFamily="Roboto"
            fallbackFontFamily="Verdana"
            webFont={{
              url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
              format: "woff2",
            }}
            fontWeight={400}
            fontStyle="normal"
          />
        </Head>
        <Body className="bg-white">
          <Container>
            <Section className="border border-solid border-gray rounded overflow-hidden">
              <Row className="p-5 pb-0">
                <Column>
                  <Heading className="text-[32px] font-bold text-center">
                    Hi,
                  </Heading>
                  <Heading
                    as="h2"
                    className="text-[26px] font-bold text-center"
                  >
                    Someone you know has not shown a sign of life for a while
                  </Heading>
                  <Heading
                    as="h2"
                    className="text-[26px] font-bold text-center text-[#33C89E]"
                  >
                    "NAME"
                  </Heading>
                  <Heading
                    as="h3"
                    className="text-[26px] font-bold text-center"
                  >
                    You may check on them it you can
                  </Heading>

                  <Text className="text-base">
                    <b>Last activity: </b>
                    timestamp
                  </Text>

                  <Text className="text-base">
                    By reciving this message means that the person in question
                    has chosen you as an emergency contact in case something
                    happens to them
                  </Text>
                </Column>
              </Row>
            </Section>

            <Text className="text-center text-xs leading-[24px] text-black/70">
              © 2026 | Life Ping
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
