/* ============================================================
   categories.js — Category filtering with mock event data
   ============================================================ */

/* ===== MOCK EVENT DATA BY CATEGORY ===== */
var CAT_EVENTS = {
  Sports: [
    {
      title: 'Elite Hoops Invitational',
      date: 'Oct 05, 2025',
      location: 'Madison Square Garden, NY',
      attendees: '3,050',
      price: '₹1,800',
      img: 'https://images.unsplash.com/photo-1546519638405-a9f2e56a73d7?w=500&q=80',
      tag: 'Basketball'
    },
    {
      title: 'Mumbai Marathon 2025',
      date: 'Nov 18, 2025',
      location: 'Marine Drive, Mumbai',
      attendees: '12,400',
      price: '₹599',
      img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&q=80',
      tag: 'Running'
    },
    {
      title: 'Premier League Watch Party',
      date: 'Oct 22, 2025',
      location: 'Sports Arena, Bangalore',
      attendees: '2,200',
      price: 'Free',
      img: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500&q=80',
      tag: 'Football'
    },
    {
      title: 'National Badminton Open',
      date: 'Dec 10, 2025',
      location: 'Sports Complex, Delhi',
      attendees: '1,800',
      price: '₹400',
      img: 'https://images.unsplash.com/photo-1529926706528-db9e5010cd4e?w=500&q=80',
      tag: 'Badminton'
    }
  ],
  Music: [
    {
      title: 'Jazz & Blues Night',
      date: 'Dec 05, 2025',
      location: 'New Orleans, LA',
      attendees: '820',
      price: '₹999',
      img: 'https://images.unsplash.com/photo-1531746790095-e5cb1571ea1f?w=500&q=80',
      tag: 'Jazz'
    },
    {
      title: 'Weekend Music Fest',
      date: 'Jun 29, 2025',
      location: 'Central Park, NY',
      attendees: '5,400',
      price: 'Free',
      img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=500&q=80',
      tag: 'Festival'
    },
    {
      title: 'Acoustic Evenings',
      date: 'Nov 08, 2025',
      location: 'Blue Note, Chicago',
      attendees: '340',
      price: '₹750',
      img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&q=80',
      tag: 'Acoustic'
    },
    {
      title: 'EDM World Tour: Mumbai',
      date: 'Jan 14, 2026',
      location: 'MMRDA Grounds, Mumbai',
      attendees: '18,000',
      price: '₹2,200',
      img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&q=80',
      tag: 'EDM'
    }
  ],
  Technology: [
    {
      title: 'AI & Machine Learning Expo',
      date: 'Oct 12, 2025',
      location: 'San Francisco, CA',
      attendees: '3,800',
      price: '₹2,499',
      img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&q=80',
      tag: 'AI / ML'
    },
    {
      title: 'Frontend Bootcamp',
      date: 'Jun 20, 2025',
      location: 'Community Hall, Pune',
      attendees: '480',
      price: 'Free',
      img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&q=80',
      tag: 'Web Dev'
    },
    {
      title: 'Cloud & DevOps Summit',
      date: 'Sep 30, 2025',
      location: 'Tech Park, Hyderabad',
      attendees: '2,100',
      price: '₹1,299',
      img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&q=80',
      tag: 'Cloud'
    },
    {
      title: 'Startup Pitch Night',
      date: 'Oct 25, 2025',
      location: 'Innovation Hub, Bangalore',
      attendees: '650',
      price: '₹200',
      img: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=500&q=80',
      tag: 'Startups'
    }
  ],
  Workshops: [
    {
      title: 'UX Masters Global Summit',
      date: 'Sep 22, 2025',
      location: 'London, UK',
      attendees: '1,240',
      price: 'Free',
      img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&q=80',
      tag: 'UX / Design'
    },
    {
      title: 'Photography Masterclass',
      date: 'Jul 14, 2025',
      location: 'Riverside Trail, SF',
      attendees: '90',
      price: '₹1,100',
      img: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=500&q=80',
      tag: 'Photography'
    },
    {
      title: 'Pottery & Ceramics Workshop',
      date: 'Aug 03, 2025',
      location: 'Art Studio, Delhi',
      attendees: '60',
      price: '₹850',
      img: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=500&q=80',
      tag: 'Art'
    },
    {
      title: 'Public Speaking Bootcamp',
      date: 'Nov 02, 2025',
      location: 'Business Hub, Chennai',
      attendees: '120',
      price: '₹600',
      img: 'https://images.unsplash.com/photo-1559223607-a43c990c692c?w=500&q=80',
      tag: 'Skills'
    }
  ],
  Festivals: [
    {
      title: 'Enchanted Forest Soirée',
      date: 'Nov 12, 2025',
      location: 'Asheville, NC',
      attendees: '5,600',
      price: '₹1,299',
      img: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=500&q=80',
      tag: 'Cultural'
    },
    {
      title: 'Diwali Food & Lights Fest',
      date: 'Oct 20, 2025',
      location: 'Connaught Place, Delhi',
      attendees: '22,000',
      price: 'Free',
      img: 'https://images.unsplash.com/photo-1574116951010-b78e9fa59b6b?w=500&q=80',
      tag: 'Cultural'
    },
    {
      title: 'Street Food Festival',
      date: 'Dec 01, 2025',
      location: 'Marine Drive, Mumbai',
      attendees: '8,400',
      price: 'Free',
      img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&q=80',
      tag: 'Food'
    },
    {
      title: 'Holi Color Run 2026',
      date: 'Mar 22, 2026',
      location: 'Jawaharlal Nehru Stadium',
      attendees: '14,000',
      price: '₹499',
      img: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=500&q=80',
      tag: 'Festival'
    }
  ],
  Business: [
    {
      title: 'Global Entrepreneur Summit',
      date: 'Oct 18, 2025',
      location: 'Convention Centre, Dubai',
      attendees: '4,200',
      price: '₹3,500',
      img: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=500&q=80',
      tag: 'Entrepreneurship'
    },
    {
      title: 'Leadership Masterclass',
      date: 'Sep 10, 2025',
      location: 'Taj Hotels, Bangalore',
      attendees: '280',
      price: '₹4,999',
      img: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=500&q=80',
      tag: 'Leadership'
    },
    {
      title: 'Networking Night: Fintech',
      date: 'Nov 06, 2025',
      location: 'BKC, Mumbai',
      attendees: '600',
      price: '₹300',
      img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&q=80',
      tag: 'Fintech'
    },
    {
      title: 'Women in Business Conclave',
      date: 'Dec 15, 2025',
      location: 'ITC Maurya, Delhi',
      attendees: '900',
      price: '₹1,200',
      img: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=500&q=80',
      tag: 'Networking'
    }
  ],
  Education: [
    {
      title: 'Global Education Summit',
      date: 'Aug 28, 2025',
      location: 'IIT Bombay, Mumbai',
      attendees: '2,800',
      price: 'Free',
      img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500&q=80',
      tag: 'Higher Ed'
    },
    {
      title: 'Data Science Bootcamp',
      date: 'Sep 15, 2025',
      location: 'Online + Bangalore Hub',
      attendees: '1,400',
      price: '₹1,999',
      img: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=500&q=80',
      tag: 'Data Science'
    },
    {
      title: 'TEDx Bangalore 2025',
      date: 'Oct 04, 2025',
      location: 'Christ University, Bangalore',
      attendees: '1,100',
      price: '₹500',
      img: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500&q=80',
      tag: 'TEDx'
    },
    {
      title: 'Science & Innovation Fair',
      date: 'Nov 22, 2025',
      location: 'Science City, Kolkata',
      attendees: '3,200',
      price: 'Free',
      img: 'https://images.unsplash.com/photo-1532094349884-543559373ff0?w=500&q=80',
      tag: 'Science'
    }
  ],
  Entertainment: [
    {
      title: 'Comedy Nights Unplugged',
      date: 'Sep 28, 2025',
      location: 'Canvas Laugh Club, Mumbai',
      attendees: '450',
      price: '₹699',
      img: 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?w=500&q=80',
      tag: 'Comedy'
    },
    {
      title: 'Bollywood Night Live',
      date: 'Oct 31, 2025',
      location: 'Jawaharlal Nehru Stadium',
      attendees: '9,800',
      price: '₹1,500',
      img: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&q=80',
      tag: 'Film'
    },
    {
      title: 'Magic & Illusion Show',
      date: 'Nov 29, 2025',
      location: 'Kingdom of Dreams, Gurgaon',
      attendees: '1,200',
      price: '₹950',
      img: 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=500&q=80',
      tag: 'Live Show'
    },
    {
      title: 'Anime & Pop Culture Expo',
      date: 'Dec 20, 2025',
      location: 'Bombay Exhibition Centre',
      attendees: '6,700',
      price: '₹399',
      img: 'https://images.unsplash.com/photo-1612444530582-fc66183b16f7?w=500&q=80',
      tag: 'Pop Culture'
    }
  ]
};

/* ===== CATEGORY CARD ACTIVE STATE ===== */
var currentCat = null;

function catFilter(category) {
  currentCat = category;

  /* Highlight active card */
  document.querySelectorAll('.cat-card').forEach(function(c) {
    c.classList.toggle('cat-card-active', c.getAttribute('data-cat') === category);
  });

  /* Build events grid */
  var events = CAT_EVENTS[category] || [];
  var grid    = document.getElementById('catEventsGrid');
  var section = document.getElementById('catEventsSection');
  var title   = document.getElementById('catFilterTitle');
  var sub     = document.getElementById('catFilterSub');
  var clearBtn= document.getElementById('catClearBtn');

  title.innerHTML = category + ' <span style="color:#a855f7">Events</span>';
  sub.textContent = events.length + ' events found in this category';
  clearBtn.style.display = 'flex';

  grid.innerHTML = events.map(function(ev) {
    return [
      '<a href="event-details.html" class="s-event-card">',
        '<div class="s-card-img">',
          '<img src="' + ev.img + '" alt="' + ev.title + '" loading="lazy" onerror="this.src=\'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&q=80\'">',
        '</div>',
        '<div class="s-card-body">',
          '<div class="s-card-category">' + ev.tag + '</div>',
          '<div class="s-card-title">' + ev.title + '</div>',
          '<div class="s-card-info-row">',
            '<span class="s-card-info-item"><span class="material-symbols-outlined">calendar_today</span>' + ev.date + '</span>',
            '<span class="s-card-info-item"><span class="material-symbols-outlined">location_on</span>' + ev.location + '</span>',
          '</div>',
          '<div class="s-card-info-item" style="margin-top:4px;"><span class="material-symbols-outlined">group</span>' + ev.attendees + ' attending</div>',
          '<div class="s-card-footer">',
            '<span class="s-card-price">' + ev.price + '</span>',
            '<button class="s-btn s-btn-sm s-btn-primary" onclick="event.preventDefault();sToast(\'Registered! 🎉\',\'success\')">Register</button>',
          '</div>',
        '</div>',
      '</a>'
    ].join('');
  }).join('');

  /* Show the section */
  section.style.display = 'block';
  section.style.paddingTop = '0';

  /* Smooth scroll to events */
  setTimeout(function() {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 80);
}

function catClearFilter() {
  currentCat = null;
  var section  = document.getElementById('catEventsSection');
  var clearBtn = document.getElementById('catClearBtn');
  section.style.display = 'none';
  clearBtn.style.display = 'none';
  document.querySelectorAll('.cat-card').forEach(function(c) {
    c.classList.remove('cat-card-active');
  });
  /* Scroll back to top of grid */
  var grid = document.querySelector('.cat-grid');
  if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', function() {
  /* Hide events section on load */
  var section = document.getElementById('catEventsSection');
  if (section) section.style.display = 'none';

  /* Check for URL param — e.g. categories.html?cat=Sports */
  var params = new URLSearchParams(window.location.search);
  var precat = params.get('cat') || params.get('search');
  if (precat) {
    var matched = Object.keys(CAT_EVENTS).find(function(k) {
      return k.toLowerCase() === precat.toLowerCase();
    });
    if (matched) catFilter(matched);
  }
});
