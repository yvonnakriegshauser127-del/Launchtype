// Скрипт для отладки кастомного майлстоуна "123"
// Выполните этот скрипт в консоли браузера (F12 -> Console)

(function() {
  console.group('🔍 DEBUG: Custom Milestone "123" Border Issue');
  
  // Находим майлстоун "123"
  var milestone = null;
  var allMilestones = document.querySelectorAll('.milestone-icon-wrapper');
  for (var i = 0; i < allMilestones.length; i++) {
    var el = allMilestones[i];
    var wrapper = el.closest('.milestone-wrapper');
    if (wrapper) {
      var nameEl = wrapper.querySelector('.milestone-name');
      if (nameEl && nameEl.textContent.trim() === '123') {
        milestone = el;
        break;
      }
    }
  }
  
  if (!milestone) {
    console.error('❌ Milestone "123" not found!');
    console.groupEnd();
    return;
  }
  
  console.log('✅ Milestone "123" found');
  
  // Информация об элементе
  var computedStyle = window.getComputedStyle(milestone);
  var inlineStyle = milestone.getAttribute('style') || '';
  
  console.group('📋 Element Info');
  console.log('Tag:', milestone.tagName);
  console.log('ID:', milestone.id);
  console.log('Classes:', milestone.className);
  console.log('Class List:', Array.from(milestone.classList));
  console.log('Data Attributes:', {
    customMilestone: milestone.getAttribute('data-custom-milestone'),
    milestoneId: milestone.getAttribute('data-milestone-id'),
    milestoneName: milestone.getAttribute('data-milestone-name'),
    isDefault: milestone.getAttribute('data-is-default')
  });
  console.log('Inline Style:', inlineStyle);
  console.log('Outer HTML:', milestone.outerHTML.substring(0, 500));
  console.groupEnd();
  
  // Computed стили
  console.group('🎨 Computed Styles');
  console.log('border:', computedStyle.border);
  console.log('border-style:', computedStyle.borderStyle);
  console.log('border-width:', computedStyle.borderWidth);
  console.log('border-color:', computedStyle.borderColor);
  console.log('border-top:', computedStyle.borderTop);
  console.log('border-right:', computedStyle.borderRight);
  console.log('border-bottom:', computedStyle.borderBottom);
  console.log('border-left:', computedStyle.borderLeft);
  console.log('isDashed:', computedStyle.borderStyle === 'dashed');
  console.log('isSolid:', computedStyle.borderStyle === 'solid');
  console.groupEnd();
  
  // CSS правила, влияющие на border
  console.group('📐 Matching CSS Rules');
  var matchingRules = [];
  try {
    var sheets = Array.from(document.styleSheets);
    for (var s = 0; s < sheets.length; s++) {
      try {
        var rules = Array.from(sheets[s].cssRules || []);
        for (var r = 0; r < rules.length; r++) {
          var rule = rules[r];
          if (rule instanceof CSSStyleRule) {
            try {
              if (milestone.matches(rule.selectorText)) {
                var border = rule.style.border || '';
                var borderStyle = rule.style.borderStyle || '';
                var borderWidth = rule.style.borderWidth || '';
                var borderColor = rule.style.borderColor || '';
                if (border || borderStyle || borderWidth || borderColor) {
                  matchingRules.push({
                    selector: rule.selectorText,
                    border: border,
                    borderStyle: borderStyle,
                    borderWidth: borderWidth,
                    borderColor: borderColor,
                    priority: rule.style.getPropertyPriority('border') || rule.style.getPropertyPriority('border-style'),
                    cssText: rule.style.cssText.substring(0, 300)
                  });
                }
              }
            } catch (e) {
              // Ignore invalid selectors
            }
          }
        }
      } catch (e) {
        // Ignore cross-origin
      }
    }
  } catch (e) {
    console.warn('Error getting CSS rules:', e);
  }
  
  // Сортируем правила по специфичности
  matchingRules.sort(function(a, b) {
    if (a.priority !== b.priority) {
      return a.priority ? -1 : 1;
    }
    var aSpecificity = (a.selector.match(/\./g) || []).length + (a.selector.match(/\[/g) || []).length + (a.selector.match(/:/g) || []).length;
    var bSpecificity = (b.selector.match(/\./g) || []).length + (b.selector.match(/\[/g) || []).length + (b.selector.match(/:/g) || []).length;
    return bSpecificity - aSpecificity;
  });
  
  console.log('Total matching rules:', matchingRules.length);
  matchingRules.forEach(function(rule, index) {
    console.log(`Rule ${index + 1}:`, rule);
  });
  console.groupEnd();
  
  // Проверка inline стилей
  console.group('💉 Inline Style Analysis');
  if (inlineStyle) {
    console.log('Inline style string:', inlineStyle);
    var styleParts = inlineStyle.split(';').filter(function(s) { return s.trim(); });
    console.log('Style parts:', styleParts);
    var borderRelated = styleParts.filter(function(s) {
      return s.toLowerCase().includes('border');
    });
    console.log('Border-related styles:', borderRelated);
  } else {
    console.log('No inline styles found');
  }
  console.groupEnd();
  
  // Визуальная проверка
  console.group('👁️ Visual Check');
  console.log('Computed border-style:', computedStyle.borderStyle);
  console.log('Expected: dashed');
  console.log('Actual:', computedStyle.borderStyle);
  if (computedStyle.borderStyle === 'dashed') {
    console.log('✅ Computed style is DASHED');
    console.warn('⚠️ If you see SOLID visually, this might be a rendering issue');
  } else {
    console.error('❌ Computed style is NOT dashed! It is:', computedStyle.borderStyle);
  }
  console.groupEnd();
  
  // Рекомендации
  console.group('💡 Recommendations');
  if (computedStyle.borderStyle !== 'dashed') {
    console.log('1. Check which CSS rule is overriding the dashed border');
    console.log('2. Verify that inline styles with !important are applied');
    console.log('3. Check if MutationObserver is working correctly');
  } else {
    console.log('1. Computed style is correct (dashed)');
    console.log('2. If visual is wrong, check browser rendering');
    console.log('3. Try increasing border-width to see if it helps');
    console.log('4. Check if there are any CSS transforms or filters affecting rendering');
  }
  console.groupEnd();
  
  console.groupEnd();
  
  // Возвращаем элемент для дальнейшей проверки
  return {
    element: milestone,
    computedStyle: {
      border: computedStyle.border,
      borderStyle: computedStyle.borderStyle,
      borderWidth: computedStyle.borderWidth,
      borderColor: computedStyle.borderColor
    },
    matchingRules: matchingRules,
    isDashed: computedStyle.borderStyle === 'dashed'
  };
})();
