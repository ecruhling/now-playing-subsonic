# Subsonic Now Playing

A dead simple, quick and dirty script that reads the Now Playing song from a [Subsonic](http://www.subsonic.org/pages/index.jsp) server and displays the title and artwork on a web page.

## Table of Contents

- [Usage](#usage)

## Usage

Replace the contents of the variables _username_, _password_ and _server_ with your own. Since this information is sent in the clear, do not use this where security is important.

That's it. The script updates every 8 seconds. This can be modified on line 60.

The script does not take into account multiple accounts playing from the same server. It will silently fail if that is the case. It will take a few minutes of only one account playing to start working again.

I like to have a separate computer set up with a small monitor with this script running in Chromium. Set Chromium to full screen and hide the address bar and you have a nice visual representation of what's playing.