<img src="https://raw.githubusercontent.com/devlotfi/life-ping/master/github-assets/github-banner.png">

# 📜 life-ping

An app that keeps track of your activity and sends alert emails in case of long inactivity

# 📌 Contents

- [Tech stack](#tech-stack)
  - [Web app](#web-app)
  - [Services](#services)
  - [Diagrams](#diagrams)
- [How does the system work ?](#how-does-the-system-work-)
- [Android App](#android-app)

# Tech stack

## Web app

<p float="left">
  <img height="50px" src="https://devlotfi.github.io/stack-icons/icons/ts.svg">
  <img height="50px" src="https://devlotfi.github.io/stack-icons/icons/reactnative.svg">
  <img height="50px" src="https://devlotfi.github.io/stack-icons/icons/expo.svg">
  <img height="50px" src="https://devlotfi.github.io/stack-icons/icons/fontawesome.svg">
  <img height="50px" src="https://devlotfi.github.io/stack-icons/icons/formik.svg">
  <img height="50px" src="https://devlotfi.github.io/stack-icons/icons/i18n.svg">
  <img height="50px" src="https://devlotfi.github.io/stack-icons/icons/react-native-paper.svg">
  <img height="50px" src="https://devlotfi.github.io/stack-icons/icons/reactnavigation.svg">
  <img height="50px" src="https://devlotfi.github.io/stack-icons/icons/tanstack-query.svg">
  <img height="50px" src="https://devlotfi.github.io/stack-icons/icons/openapi.svg">
</p>

## Services

<p float="left">
  <img height="50px" src="https://devlotfi.github.io/stack-icons/icons/cloudflare.svg">
  <img height="50px" src="https://devlotfi.github.io/stack-icons/icons/resend.svg">
</p>

## Diagrams

<p float="left">
  <img height="50px" src="https://devlotfi.github.io/stack-icons/icons/drawio.svg">
</p>

# How does the system work ?

- The user periodicly presses the ping button to mark his activity
- The cloudflare worker keeps track of how long the user has been inactive
- If more than 36h have passed it sends alert e-mails with resend to defined contacts

<img src="https://raw.githubusercontent.com/devlotfi/life-ping/master/github-assets/working-diagram.png">

# Android App

<img src="https://raw.githubusercontent.com/devlotfi/life-ping/master/github-assets/preview-1.png">
<img src="https://raw.githubusercontent.com/devlotfi/life-ping/master/github-assets/preview-2.png">
