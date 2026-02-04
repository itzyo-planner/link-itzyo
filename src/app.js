document.addEventListener('DOMContentLoaded', function () {
  // Tab switching
  var tabs = document.querySelectorAll('.tab');
  var tabMap = { page: 'tab-page', design: 'tab-design', analytics: 'tab-analytics', manage: 'tab-manage', marketing: 'tab-marketing' };

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      Object.values(tabMap).forEach(function (id) {
        document.getElementById(id).classList.remove('active');
      });
      document.getElementById(tabMap[tab.dataset.tab]).classList.add('active');
    });
  });

  // Collapse toggle
  document.querySelectorAll('.collapse-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var target = btn.dataset.target || btn.closest('.section-header').dataset.target;
      if (target) {
        var body = document.getElementById(target);
        if (body) body.classList.toggle('collapsed');
      }
    });
  });

  document.querySelectorAll('.section-header.clickable').forEach(function (header) {
    header.addEventListener('click', function () {
      var target = header.dataset.target;
      if (target) {
        var body = document.getElementById(target);
        if (body) body.classList.toggle('collapsed');
      }
    });
  });

  // Option selectors (layout, size, shape, action, font, colors)
  function setupOptionGroup(selector, activeClass) {
    document.querySelectorAll(selector).forEach(function (opt) {
      opt.addEventListener('click', function () {
        opt.closest('.layout-options, .size-options, .shape-options, .action-options, .font-grid, .color-grid, .btn-colors')
          .querySelectorAll(selector).forEach(function (o) { o.classList.remove(activeClass || 'active'); });
        opt.classList.add(activeClass || 'active');
        updatePreview();
      });
    });
  }

  setupOptionGroup('.layout-opt');
  setupOptionGroup('.size-opt');
  setupOptionGroup('.shape-opt');
  setupOptionGroup('.action-opt');
  setupOptionGroup('.font-opt');
  setupOptionGroup('.color-swatch');
  setupOptionGroup('.btn-color-swatch');

  // Live preview updates
  var titleInput = document.getElementById('titleInput');
  var bioInput = document.getElementById('bioInput');
  var phoneUsername = document.getElementById('phoneUsername');
  var phoneBio = document.getElementById('phoneBio');
  var phoneLinks = document.getElementById('phoneLinks');

  titleInput.addEventListener('input', function () {
    phoneUsername.textContent = titleInput.value;
  });
  bioInput.addEventListener('input', function () {
    phoneBio.textContent = bioInput.value;
  });

  // Link management
  var singleLinks = [];
  var groupLinks = [];

  document.getElementById('addSingleLink').addEventListener('click', function () {
    var title = document.getElementById('singleLinkTitle');
    var url = document.getElementById('singleLinkUrl');
    if (!title.value || !url.value) return;
    singleLinks.push({ title: title.value, url: url.value });
    title.value = '';
    url.value = '';
    renderLinks();
    updatePreview();
  });

  document.getElementById('addGroupLink').addEventListener('click', function () {
    var name = document.getElementById('groupLinkName');
    var title = document.getElementById('groupLinkTitle');
    var url = document.getElementById('groupLinkUrl');
    if (!title.value || !url.value) return;
    groupLinks.push({ group: name.value, title: title.value, url: url.value });
    name.value = '';
    title.value = '';
    url.value = '';
    renderLinks();
    updatePreview();
  });

  function renderLinks() {
    var singleList = document.getElementById('singleLinkList');
    singleList.innerHTML = '';
    singleLinks.forEach(function (link, i) {
      var div = document.createElement('div');
      div.className = 'link-added-item';
      div.innerHTML = '<span>' + escapeHtml(link.title) + '</span><button class="link-remove-btn" data-type="single" data-index="' + i + '">&times;</button>';
      singleList.appendChild(div);
    });

    var groupList = document.getElementById('groupLinkList');
    groupList.innerHTML = '';
    groupLinks.forEach(function (link, i) {
      var div = document.createElement('div');
      div.className = 'link-added-item';
      div.innerHTML = '<span>' + escapeHtml(link.group ? link.group + ' - ' : '') + escapeHtml(link.title) + '</span><button class="link-remove-btn" data-type="group" data-index="' + i + '">&times;</button>';
      groupList.appendChild(div);
    });

    document.querySelectorAll('.link-remove-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var type = btn.dataset.type;
        var index = parseInt(btn.dataset.index);
        if (type === 'single') singleLinks.splice(index, 1);
        else groupLinks.splice(index, 1);
        renderLinks();
        updatePreview();
      });
    });
  }

  function updatePreview() {
    phoneLinks.innerHTML = '';
    var btnColor = '#000';
    var activeBtnSwatch = document.querySelector('.btn-color-swatch.active');
    if (activeBtnSwatch && activeBtnSwatch.dataset.btncolor !== 'custom') {
      btnColor = activeBtnSwatch.dataset.btncolor;
    }

    var borderRadius = '8px';
    var activeShape = document.querySelector('.shape-opt.active');
    if (activeShape) {
      var shape = activeShape.dataset.shape;
      if (shape === 'rounded') borderRadius = '20px';
      else if (shape === 'pill') borderRadius = '24px';
    }

    singleLinks.forEach(function (link) {
      var a = document.createElement('a');
      a.className = 'phone-link-btn';
      a.href = link.url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = link.title;
      a.style.background = btnColor;
      a.style.borderRadius = borderRadius;
      phoneLinks.appendChild(a);
    });

    groupLinks.forEach(function (link) {
      var a = document.createElement('a');
      a.className = 'phone-link-btn';
      a.href = link.url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = link.title;
      a.style.background = btnColor;
      a.style.borderRadius = borderRadius;
      phoneLinks.appendChild(a);
    });
  }

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
  }
});
