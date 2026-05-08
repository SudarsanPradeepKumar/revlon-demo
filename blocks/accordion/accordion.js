export default function decorate(block) {
    const rows = [...block.children];
  
    if (!rows.length) {
      block.textContent = '';
      return;
    }
  
    const items = rows
      .map((row, index) => {
        const cells = [...row.children];
        const titleCell = cells[0];
        const bodyCell = cells[1];
  
        if (!titleCell || !bodyCell) return null;
  
        const title = titleCell.textContent.trim();
        if (!title) return null;
  
        const item = document.createElement('div');
        item.className = 'accordion-item';
  
        const heading = document.createElement('h3');
        heading.className = 'accordion-heading';
  
        const button = document.createElement('button');
        button.className = 'accordion-trigger';
        button.type = 'button';
        button.setAttribute('aria-expanded', index === 0 ? 'true' : 'false');
  
        const panelId = `accordion-panel-${Math.random().toString(36).slice(2, 10)}`;
        const buttonId = `accordion-button-${Math.random().toString(36).slice(2, 10)}`;
  
        button.id = buttonId;
        button.setAttribute('aria-controls', panelId);
  
        const titleSpan = document.createElement('span');
        titleSpan.className = 'accordion-title';
        titleSpan.textContent = title;
  
        const icon = document.createElement('span');
        icon.className = 'accordion-icon';
        icon.setAttribute('aria-hidden', 'true');
        icon.textContent = '+';
  
        button.append(titleSpan, icon);
        heading.append(button);
  
        const panel = document.createElement('div');
        panel.className = 'accordion-panel';
        panel.id = panelId;
        panel.setAttribute('role', 'region');
        panel.setAttribute('aria-labelledby', buttonId);
  
        if (index !== 0) {
          panel.hidden = true;
        }
  
        const panelInner = document.createElement('div');
        panelInner.className = 'accordion-panel-inner';
  
        while (bodyCell.firstChild) {
          panelInner.append(bodyCell.firstChild);
        }
  
        panel.append(panelInner);
        item.append(heading, panel);
  
        button.addEventListener('click', () => {
          const expanded = button.getAttribute('aria-expanded') === 'true';
          button.setAttribute('aria-expanded', String(!expanded));
          panel.hidden = expanded;
        });
  
        return item;
      })
      .filter(Boolean);
  
    block.textContent = '';
    items.forEach((item) => block.append(item));
  }