// Mobile Navigation Toggle
document.addEventListener("DOMContentLoaded", function () {
  const navToggle = document.getElementById("nav-toggle");
  const navContent = document.getElementById("nav-content");
  const header = document.getElementById("header");

  // Initially hide the header
  header.classList.remove("visible");

  // Function to toggle header visibility on scroll
  function handleHeaderVisibility() {
    const videoSection = document.querySelector(".video-section");
    const videoSectionHeight = videoSection.offsetHeight;

    if (window.scrollY > videoSectionHeight * 0.8) {
      header.classList.add("visible");
    } else {
      header.classList.remove("visible");
    }
  }

  // Run the check on page load and scroll
  handleHeaderVisibility();

  window.addEventListener("scroll", handleHeaderVisibility);

  // Video Player Controls
  const heroVideo = document.getElementById("hero-video");
  const muteToggle = document.getElementById("mute-toggle");

  // Function to set up video with sound enabled by default
  let userInteracted = false;

  // Unmute video on user interaction (click or scroll)
  function setupVideoWithSound() {
    if (heroVideo) {
      heroVideo.muted = false;
      heroVideo.play().catch((error) => {
        console.log(
          "Autoplay with sound prevented by browser policy, waiting for user interaction"
        );
        heroVideo.muted = true;
        updateMuteButtonIcon(true);
      });

      updateMuteButtonIcon(heroVideo.muted);
    }
  }

  // Mute/unmute functionality on button click
  function updateMuteButtonIcon(isMuted) {
    if (muteToggle) {
      if (isMuted) {
        muteToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
      } else {
        muteToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
      }
    }
  }

  // Try to enable sound immediately
  setupVideoWithSound();

  // Event listeners for user interaction - used as fallback if autoplay with sound fails
  if (heroVideo) {
    // Click anywhere to unmute if browser blocked autoplay with sound
    document.addEventListener(
      "click",
      function () {
        if (heroVideo.muted) {
          heroVideo.muted = false;
          updateMuteButtonIcon(false);
          heroVideo.play();
        }
      },
      { once: true }
    );

    // Scroll event as another opportunity to unmute
    document.addEventListener(
      "scroll",
      function () {
        if (heroVideo.muted) {
          heroVideo.muted = false;
          updateMuteButtonIcon(false);
          heroVideo.play();
        }
      },
      { once: true }
    );

    // Mute toggle button functionality
    if (muteToggle) {
      muteToggle.addEventListener("click", function (e) {
        e.stopPropagation(); // Prevent this from triggering the document click
        e.preventDefault(); // Prevent default behavior
        heroVideo.muted = !heroVideo.muted;
        updateMuteButtonIcon(heroVideo.muted);
      });

      // Prevent any hover effects from affecting video
      muteToggle.addEventListener("mouseenter", function (e) {
        e.stopPropagation();
      });

      muteToggle.addEventListener("mouseleave", function (e) {
        e.stopPropagation();
      });
    }

    // Initialize the button icon
    updateMuteButtonIcon(true);

    // Ensure video plays on mobile and stays visible
    heroVideo.addEventListener("canplaythrough", function () {
      heroVideo.play().catch((error) => {
        console.log("Autoplay prevented:", error);
      });
    });

    // Keep video visible at all times - remove any opacity transitions
    // Remove any scroll event listeners that change video visibility

    // Ensure video stays visible by removing any opacity changes
    heroVideo.style.removeProperty("opacity");
    heroVideo.style.removeProperty("transition");

    // Use a better approach for video visibility in scroll events
    let scrollTimeout;
    window.addEventListener("scroll", function () {
      // Clear timeout if set
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      // Set a timeout to prevent rapid changes during scroll
      scrollTimeout = setTimeout(function () {
        // Only check if we need to pause the video when completely out of view
        const videoSection = document.querySelector(".video-section");
        const videoRect = videoSection.getBoundingClientRect();

        // Only pause/play video if it's completely out of viewport to save resources
        // Don't change opacity/visibility - that causes flickering
        if (videoRect.bottom < 0 || videoRect.top > window.innerHeight) {
          if (!heroVideo.paused) heroVideo.pause();
        } else {
          if (heroVideo.paused) heroVideo.play();
        }
      }, 2000);
    });
  }

  // Mobile Navigation Toggle Functionality
  if (navToggle && navContent) {
    navToggle.addEventListener("click", function () {
      navContent.classList.toggle("hidden");
      navContent.classList.toggle("block");
    });
  }

  // Close mobile menu when clicking on a navigation link
  const navLinks = document.querySelectorAll("#nav-content a");
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      if (window.innerWidth < 1024) {
        navContent.classList.add("hidden");
        navContent.classList.remove("block");
      }
    });
  });

  // Testimonial Slider Functionality
  const testimonialSlides = document.querySelectorAll(".testimonial-slide");
  const testimonialDots = document.querySelectorAll(".testimonial-dot");

  if (testimonialSlides.length > 0 && testimonialDots.length > 0) {
    testimonialDots.forEach((dot) => {
      dot.addEventListener("click", function () {
        const slideIndex = this.getAttribute("data-index");

        // Hide all slides and remove active class from dots
        testimonialSlides.forEach((slide) => {
          slide.classList.remove("active");
        });
        testimonialDots.forEach((dot) => {
          dot.classList.remove("active");
        });

        // Show selected slide and activate dot
        testimonialSlides[slideIndex].classList.add("active");
        this.classList.add("active");
      });
    });

    // Auto-rotate testimonials every 5 seconds
    let currentTestimonial = 0;
    setInterval(() => {
      currentTestimonial = (currentTestimonial + 1) % testimonialSlides.length;

      // Hide all slides and remove active class from dots
      testimonialSlides.forEach((slide) => {
        slide.classList.remove("active");
      });
      testimonialDots.forEach((dot) => {
        dot.classList.remove("active");
      });

      // Show next slide and activate dot
      testimonialSlides[currentTestimonial].classList.add("active");
      testimonialDots[currentTestimonial].classList.add("active");
    }, 5000);
  }

  // Charts
  if (typeof Chart !== "undefined") {
    // Budget Allocation Chart
    const budgetCtx = document.getElementById("budgetChart");
    if (budgetCtx) {
      new Chart(budgetCtx, {
        type: "doughnut",
        data: {
          labels: [
            "Law Enforcement",
            "Equipment",
            "Physical Barriers",
            "Administrative",
            "Other",
          ],
          datasets: [
            {
              data: [45, 25, 15, 10, 5],
              backgroundColor: [
                "#1e40af",
                "#3b82f6",
                "#60a5fa",
                "#93c5fd",
                "#bfdbfe",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                boxWidth: 12,
              },
            },
            title: {
              display: true,
              text: "Operation Lone Star Budget Allocation",
            },
          },
        },
      });
    }

    // Human Impact Chart
    const impactCtx = document.getElementById("impactChart");
    if (impactCtx) {
      new Chart(impactCtx, {
        type: "bar",
        data: {
          labels: [
            "Detentions",
            "Family Separations",
            "Medical Incidents",
            "Legal Challenges",
            "Community Displacement",
          ],
          datasets: [
            {
              label: "Number of Reported Cases",
              data: [4500, 1200, 800, 350, 600],
              backgroundColor: "#3b82f6",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: true,
              text: "Human Impact Metrics",
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }

    // Legal Challenges Chart
    const legalCtx = document.getElementById("legalChart");
    if (legalCtx) {
      new Chart(legalCtx, {
        type: "pie",
        data: {
          labels: [
            "Civil Rights",
            "Due Process",
            "Federal Overreach",
            "Environmental",
            "Property Rights",
          ],
          datasets: [
            {
              data: [35, 25, 20, 10, 10],
              backgroundColor: [
                "#dc2626",
                "#ef4444",
                "#f87171",
                "#fca5a5",
                "#fecaca",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                boxWidth: 12,
              },
            },
            title: {
              display: true,
              text: "Types of Legal Challenges",
            },
          },
        },
      });
    }
  }

  // Copy to Clipboard Functionality for Sharing Links
  const shareButton = document.querySelector(
    'button:contains("Copy Shareable Link")'
  );
  if (shareButton) {
    shareButton.addEventListener("click", function () {
      const url = window.location.href;
      navigator.clipboard.writeText(url).then(() => {
        const originalText = this.textContent;
        this.textContent = "Link Copied!";
        this.classList.add("bg-green-600");

        setTimeout(() => {
          this.textContent = originalText;
          this.classList.remove("bg-green-600");
        }, 2000);
      });
    });
  }

  // Social Media Toolkit Functionality
  const socialMediaPacks = {
    "twitter-pack": "Operation_Lone_Star_Twitter_Pack.zip",
    "instagram-pack": "Operation_Lone_Star_Instagram_Pack.zip",
    "facebook-pack": "Operation_Lone_Star_Facebook_Pack.zip",
    "tiktok-pack": "Operation_Lone_Star_TikTok_Pack.zip",
  };

  // Handle social media pack downloads
  document.querySelectorAll(".post-template").forEach((template) => {
    template.addEventListener("click", (e) => {
      if (!e.target.classList.contains("share-button")) {
        e.preventDefault();
        const pack = template.getAttribute("data-download");
        const fileName = socialMediaPacks[pack];

        // Simulate download (in real implementation, this would be a real file download)
        template.classList.add("downloading");
        setTimeout(() => {
          alert(`Downloading ${fileName}`);
          template.classList.remove("downloading");
        }, 500);
      }
    });
  });

  // Add activity to feed
  function addActivityToFeed(message) {
    const activityItem = document.createElement("div");
    activityItem.className =
      "bg-white p-3 rounded shadow-sm border border-gray-100 fade-in";
    activityItem.innerHTML = `
      <div class="flex items-center">
        <i class="fas fa-user-circle text-gray-400 mr-2"></i>
        <span class="text-sm">${message}</span>
      </div>
      <span class="text-xs text-gray-500">Just now</span>
    `;
    activityFeed.insertBefore(activityItem, activityFeed.firstChild);

    // Remove old items if more than 5
    if (activityFeed.children.length > 5) {
      activityFeed.removeChild(activityFeed.lastChild);
    }
  }

  // Simulate live activity
  setInterval(() => {
    const randomMessage =
      engagementMessages[Math.floor(Math.random() * engagementMessages.length)];
    addActivityToFeed(randomMessage);
    updateShareCounter();
  }, 8000);

  // Share Now buttons
  const shareNowButtons = document.querySelectorAll(".share-now-btn");
  shareNowButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const platform = this.getAttribute("data-platform");
      let shareText =
        platform === "x"
          ? "$11B wasted on Operation Lone Star while Texas schools lack funding. Time for change! #StopOLS #InvestInTexas"
          : "EXPOSED: Operation Lone Star has spent $11 billion of taxpayer money, with 80% of arrests being US citizens.";

      navigator.clipboard.writeText(shareText).then(() => {
        const originalText = this.textContent;
        this.textContent = "Copied!";
        this.classList.add("bg-green-500");
        updateShareCounter();
        addActivityToFeed(`New ${platform} share! 🎉`);

        setTimeout(() => {
          this.textContent = originalText;
          this.classList.remove("bg-green-500");
        }, 2000);
      });
    });
  });

  // Download toolkit button
  const downloadToolkit = document.querySelector(".download-toolkit");
  if (downloadToolkit) {
    downloadToolkit.addEventListener("click", function () {
      this.innerHTML = '<i class="fas fa-check"></i> Downloaded!';
      this.classList.add("bg-green-600");
      addActivityToFeed("New toolkit download! 📚");

      setTimeout(() => {
        this.innerHTML = "Download Complete Toolkit";
        this.classList.remove("bg-green-600");
      }, 2000);
    });
  }

  // Animated counter functionality
  function animateCounters() {
    const counters = document.querySelectorAll(".animate-counter");

    counters.forEach((counter) => {
      const target = parseInt(counter.getAttribute("data-target"));
      const duration = parseInt(
        counter.getAttribute("data-duration") || "2000"
      );
      let startTime = null;

      function updateCounter(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const currentValue = Math.floor(progress * target);

        counter.textContent = currentValue.toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target.toLocaleString();
          // Add the class for the +1 animation
          setInterval(() => {
            counter.classList.add("increasing");
            setTimeout(() => {
              counter.classList.remove("increasing");
            }, 2000);
          }, 5000 + Math.random() * 10000); // Random interval for natural feel
        }
      }

      // Start animation when element is in viewport
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              requestAnimationFrame(updateCounter);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );

      observer.observe(counter);
    });
  }

  // Call our new functions
  animateCounters();

  // Animated counter for waste-counter
  let wasteObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          let counter = document.getElementById("waste-counter");
          if (counter) {
            let amount = 0;
            let target = 11000000000;
            let interval = setInterval(() => {
              amount += 50000000;
              counter.innerText = `$${amount.toLocaleString()}`;
              if (amount >= target) {
                clearInterval(interval);
                counter.innerText = "$11,000,000,000";
              }
            }, 50);
            wasteObserver.unobserve(entry.target);
          }
        }
      });
    },
    { threshold: 0.5 }
  );

  // Observe waste counter
  const wasteCounter = document.getElementById("waste-counter");
  if (wasteCounter) {
    wasteObserver.observe(wasteCounter);
  }

  // Add glitch effect on scroll
  // Funding explanation fade-in
  const fundingExplanationObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animated");
          fundingExplanationObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  // Observe funding explanation
  const fundingExplanation = document.querySelector(".funding-explanation");
  if (fundingExplanation) {
    fundingExplanationObserver.observe(fundingExplanation);
  }

  // Governor image hover and click effect
  const imageContainer = document.querySelector(".image-container");
  const governorOverlay = document.querySelector(".governor-overlay");

  if (imageContainer && governorOverlay) {
    imageContainer.addEventListener("mouseenter", () => {
      governorOverlay.style.transform = "translateY(-10px)";
      governorOverlay.style.boxShadow = "0 15px 30px rgba(255, 0, 0, 0.3)";
    });

    imageContainer.addEventListener("mouseleave", () => {
      governorOverlay.style.transform = "translateY(0)";
      governorOverlay.style.boxShadow = "none";
    });

    imageContainer.addEventListener("click", () => {
      const callout = document.querySelector(".callout");
      if (callout) {
        callout.style.fontSize = "2rem";
        callout.style.animation = "pulse-red 1s infinite";

        setTimeout(() => {
          callout.style.fontSize = "";
          callout.style.animation = "";
        }, 3000);
      }

      // Trigger waste counter to show full amount immediately
      const wasteCounter = document.getElementById("waste-counter");
      if (wasteCounter) {
        wasteCounter.innerHTML = "$11,000,000,000";
        wasteCounter.style.animation = "pulse-red 1s infinite";

        setTimeout(() => {
          wasteCounter.style.animation = "";
        }, 3000);
      }
    });
  }

  const glitchElements = document.querySelectorAll(".glitch");
  if (glitchElements.length > 0) {
    window.addEventListener("scroll", function () {
      glitchElements.forEach((element) => {
        if (isElementInViewport(element)) {
          element.classList.add("glitching");

          // Remove class after animation completes
          setTimeout(() => {
            element.classList.remove("glitching");
          }, 2000);
        }
      });
    });
  }

  // Helper function to check if element is in viewport
  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  // Ensure financial breakdown animation runs when visible
  function animateFinancialBreakdown() {
    console.log("🔥 Financial Breakdown Animation Initialized");

    const counter = document.getElementById("waste-counter");
    if (!counter) {
      console.warn("⚠️ waste-counter element not found! Check your HTML.");
      return;
    }

    let target = 11000000000; // $11 billion
    let increment = 50000000; // $50 million increments
    let amount = 0;

    function startCounterAnimation() {
      console.log("🔄 Starting counter animation...");

      let interval = setInterval(() => {
        amount += increment;
        counter.innerText = `$${amount.toLocaleString()}`;

        console.log(`💰 Updating counter: ${counter.innerText}`);

        if (amount >= target) {
          counter.innerText = "$11,000,000,000"; // Ensure exact final value
          clearInterval(interval);
          console.log("✅ Counter animation complete!");
        }
      }, 50); // Smooth animation
    }

    function handleObserver(entries, observer) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log("🟢 Observer triggered! Counter should start.");
          startCounterAnimation();
          observer.unobserve(entry.target); // Stop observing after trigger
        }
      });
    }

    // Set up Intersection Observer
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.2,
    });

    const financialSection = document.getElementById("financial-breakdown");
    if (financialSection) {
      observer.observe(financialSection);
      console.log("👀 Observing financial breakdown section...");
    } else {
      console.warn("⚠️ financial-breakdown element not found!");
    }

    // 🚀 **Immediately start if section is already visible (prevents no-animation issue)**
    if (
      financialSection &&
      financialSection.getBoundingClientRect().top < window.innerHeight
    ) {
      console.log("🔵 Section is already visible, starting animation now!");
      startCounterAnimation();
    }
  }

  // **Run after the page fully loads**
  window.addEventListener("load", animateFinancialBreakdown);

  // **Optional Manual Start Button for Debugging**
  document.addEventListener("keydown", (event) => {
    if (event.key === "c") {
      console.log("🆕 Manually starting counter animation...");
      animateFinancialBreakdown();
    }
  });

  // Enhanced animations on scroll
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.15,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe sections for basic fade-in
  const sections = document.querySelectorAll("section > div");
  sections.forEach((section) => {
    observer.observe(section);
  });

  // New scroll animation observer for enhanced effects
  const scrollAnimateObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animated");
          scrollAnimateObserver.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      rootMargin: "-10% 0px",
      threshold: 0.2,
    }
  );

  // Add hover effects to key facts
  const keyFacts = document.querySelectorAll(".key-fact");
  keyFacts.forEach((fact) => {
    fact.addEventListener("mouseenter", function () {
      this.querySelector(".icon-container").style.transform =
        "scale(1.2) rotate(5deg)";
    });

    fact.addEventListener("mouseleave", function () {
      this.querySelector(".icon-container").style.transform =
        "scale(1) rotate(0deg)";
    });
  });
});

// Fix for the querySelector contains selector used above
if (!Element.prototype.matches) {
  Element.prototype.matches =
    Element.prototype.msMatchesSelector ||
    Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function (s) {
    let el = this;
    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}

NodeList.prototype.forEach = Array.prototype.forEach;

// Safe version of contains selector functionality
HTMLButtonElement.prototype.containsText = function (text) {
  return this.textContent.includes(text);
};

// Find buttons by text content safely without overriding querySelector
function findButtonWithText(text) {
  const buttons = document.querySelectorAll("button");
  for (let i = 0; i < buttons.length; i++) {
    if (buttons[i].textContent.includes(text)) {
      return buttons[i];
    }
  }
  return null;
}

const shareButton = findButtonWithText("Copy Shareable Link");
if (shareButton) {
  shareButton.addEventListener("click", function () {});
}

animateFinancialBreakdown();
