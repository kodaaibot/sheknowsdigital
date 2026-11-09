---
title: "What’s Robots.txt and how it can help with your SEO."
titleTag: "What’s Robots.txt and how it can help with your SEO. - SHE KNOWS DIGITAL"
description: "Understanding the technical side of your website or blog may not be the most fun part of it, but it will help you get the results you need. Robots.txt is one of the many elements ‘back of house’ at your website that you need to get to grips with to ensure you are getting the"
excerpt: "Understanding the technical side of your website or blog may not be the most fun part of it, but it will help you get the results you need. Robots.txt is one of the many elements ‘back of house’ at your website that you need to get to grips with to ensure you are getting the…"
date: "2016-11-19T13:03:09"
modified: "2016-11-19T13:03:09"
categories: ["seo-traffic"]
ogImage: "https://www.sheknowsdigital.com/wp-content/uploads/2021/12/she-knows-digital-logo.png"
---

Understanding the technical side of your website or blog may not be the most fun part of it, but it will help you get the results you need. Robots.txt is one of the many elements ‘back of house’ at your website that you need to get to grips with to ensure you are getting the most out of your SEO work. Here I’ll be taking a closer look at what robots.txt actually is, how to check whether yours is functioning and in place and also how to create or update it from scratch.

## What is robots.txt?

Robots.txt is a text file (.txt), not a HTML file as is often thought, which you put onto your website server to tell search engines and their bots which pages should not be scanned and visited. It is also known as the robots exclusion standard or robots exclusion protocol and has been around since 1994.

**It is a file that a site owner creates to provide instructions directly to the web robots not to crawl some specific parts of a website to ensure only the important parts are crawled.**

For example, you may want search engines to block from crawling your pdf directory on your website as you may want those pdf be only visible to users who want to subscribe to your email list. Robots.txt will let you tell search engines to avoid that particularly directory when crawling.

**Important:** it doesn’t mean that the pdf won’t be indexed! Robots.txt tells Google not to crawl it when they visit your site directly, but if they come to your site from direct links to pdf file, they may still add your pdf to their index! I have a short tutorial how to exclude your pdf completely from being found in Google index.

It isn’t mandatory for robots to avoid these areas of your site but most search engines do. It is also important to remember that robots.txt is a public file so anyone will be able to see which areas of your site you want to keep hidden from bots.

## Do you have a robots.txt File?

Many website owners don’t even know if they have a robots.txt file in place, or may not even have heard of it. You can check it manually by going the url: http://yourdomain/robots.txt, for this website it will be:

[https://www.sheknowsdigital.com/robots.txt](/robots.txt) (you can actually go to this URL and check it yourself).

You can also check if it is already on your site in Google Search Console by visiting [Google robots.txt test.](https://www.google.com/webmasters/tools/robots-testing-tool?pli=1) Google will tell you immediately whether you have a functional robots.txt file in place.

## How to Create and Update your robots.txt

The Google tool mentioned above can help you create a robots.txt file. You can also create it yourself by using TextEdit on Mac or Text Editor on Windows computer and save it as robots.txt.

When the file is created, it’s time to upload robots.txt file to your website using File Manager within your hosting package or an FTP client. Make sure you access the root of your domain and you save your robots.txt code as a text file or it will be ineffective.

It can be hard to know where to start once you’ve gone behind the scenes of your website but most servers and domain providers have a very straightforward setup and you can access their help and guidance too, which is often very helpful.

Again, it important to remember your robots.txt file must be kept in the top level directory of your web server and when you enter the file manager you should be able to find the /robots.txt file already in place. It may be empty in which case you can begin to add in the relevant allow and disallows or it may be ready for you to update with anything additional you want to add.

A few examples of robots.txt implementations.

### Example 1:

On the most basic level many websites will have a robots.txt file which reads:

![robotstxt-example1](/wp-content/uploads/2016/11/Robotstxt-Example1.png)

This says that all pages and files can be crawlable by Google (and all other search engines) on this website. In other words, nothing is blocked from Google and other bots.

### Example 2:

This excludes all robots from the server:

![robotstxt-example2](/wp-content/uploads/2016/11/Robotstxt-Example2.png)

Once you have the disallow function in place you can choose any directories or folders on your server.

### Example 3:

This one is actually example from this website:

![robotstxt-example3](/wp-content/uploads/2016/11/Robotstxt-Example3.png)

Here I have blocked Google from crawling [my SEO ebook](/seo-ebook/), which is my iconic;) freebie, but I do not want website visitors to access it from Google, without going through my email subscription signup form first:)

## Summary

Robots.txt is a minuscule text file when compared to the size of your website and server but it is very valuable. If you write the file in a wrong way, you may tell search engines not to crawl important parts of your website. As a result they may not crawl it and not rank it for targeted terms! Be very careful when putting your robots.txt together and ensure the search engine robots are definitely crawling the pages you want them to crawl.
