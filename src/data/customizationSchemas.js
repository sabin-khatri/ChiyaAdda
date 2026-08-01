/**
 * Per-item customization schemas — each menu item gets only relevant options.
 */

export const customizationTemplates = {
  'milk-tea': {
    label: 'Milk Tea',
    groups: [
      {
        id: 'temp',
        label: 'Temperature',
        icon: '🌡️',
        layout: 'row',
        choices: [
          { value: 'Hot', label: 'Hot' },
          { value: 'Iced', label: 'Iced' },
        ],
      },
      {
        id: 'sugar',
        label: 'Sugar Level',
        icon: '🍯',
        layout: 'grid-4',
        choices: [
          { value: 'None', label: 'None' },
          { value: '25%', label: '25%' },
          { value: '50%', label: '50%' },
          { value: '100%', label: '100%' },
        ],
      },
      {
        id: 'milk',
        label: 'Milk',
        icon: '🥛',
        layout: 'grid-2',
        choices: [
          { value: 'Regular', label: 'Regular' },
          { value: 'Less', label: 'Less Milk' },
          { value: 'Extra', label: 'Extra Milk', priceModifier: 15 },
        ],
      },
    ],
    defaults: { temp: 'Hot', sugar: '100%', milk: 'Regular' },
  },

  'black-tea': {
    label: 'Black Tea',
    groups: [
      {
        id: 'temp',
        label: 'Temperature',
        icon: '🌡️',
        layout: 'row',
        choices: [
          { value: 'Hot', label: 'Hot' },
          { value: 'Iced', label: 'Iced' },
        ],
      },
      {
        id: 'sugar',
        label: 'Sugar Level',
        icon: '🍯',
        layout: 'grid-4',
        choices: [
          { value: 'None', label: 'None' },
          { value: '25%', label: '25%' },
          { value: '50%', label: '50%' },
          { value: '100%', label: '100%' },
        ],
      },
    ],
    defaults: { temp: 'Hot', sugar: 'None' },
  },

  'ginger-tea': {
    label: 'Ginger Tea',
    groups: [
      {
        id: 'temp',
        label: 'Serving',
        icon: '🌡️',
        layout: 'row',
        choices: [
          { value: 'Hot', label: 'Hot' },
          { value: 'Warm', label: 'Warm' },
        ],
      },
      {
        id: 'ginger',
        label: 'Ginger Intensity',
        shortLabel: 'Ginger',
        icon: '🫚',
        layout: 'grid-3',
        choices: [
          { value: 'Light', label: 'Light' },
          { value: 'Regular', label: 'Regular' },
          { value: 'Extra', label: 'Extra Ginger', shortLabel: 'Extra' },
        ],
      },
      {
        id: 'lemon',
        label: 'Extra Lemon',
        shortLabel: 'Lemon',
        icon: '🍋',
        layout: 'row',
        choices: [
          { value: 'Regular', label: 'Regular' },
          { value: 'Extra', label: 'Extra Lemon', shortLabel: 'Extra', priceModifier: 10 },
        ],
      },
    ],
    defaults: { temp: 'Hot', ginger: 'Regular', lemon: 'Regular' },
  },

  'honey-ginger-tea': {
    label: 'Honey Ginger Tea',
    groups: [
      {
        id: 'temp',
        label: 'Serving',
        icon: '🌡️',
        layout: 'row',
        choices: [
          { value: 'Hot', label: 'Hot' },
          { value: 'Warm', label: 'Warm' },
        ],
      },
      {
        id: 'ginger',
        label: 'Ginger Intensity',
        icon: '🫚',
        layout: 'grid-3',
        choices: [
          { value: 'Light', label: 'Light' },
          { value: 'Regular', label: 'Regular' },
          { value: 'Extra', label: 'Extra Ginger' },
        ],
      },
    ],
    defaults: { temp: 'Hot', ginger: 'Regular' },
  },

  'mint-tea': {
    label: 'Mint Tea',
    groups: [
      {
        id: 'temp',
        label: 'Temperature',
        icon: '🌡️',
        layout: 'row',
        choices: [
          { value: 'Hot', label: 'Hot' },
          { value: 'Iced', label: 'Iced' },
        ],
      },
      {
        id: 'sugar',
        label: 'Sugar Level',
        icon: '🍯',
        layout: 'grid-4',
        choices: [
          { value: 'None', label: 'None' },
          { value: '25%', label: '25%' },
          { value: '50%', label: '50%' },
          { value: '100%', label: '100%' },
        ],
      },
      {
        id: 'mint',
        label: 'Mint Freshness',
        shortLabel: 'Mint',
        icon: '🌿',
        layout: 'grid-3',
        choices: [
          { value: 'Light', label: 'Light' },
          { value: 'Regular', label: 'Regular' },
          { value: 'Extra', label: 'Extra Mint' },
        ],
      },
    ],
    defaults: { temp: 'Hot', sugar: '50%', mint: 'Regular' },
  },

  'cappuccino': {
    label: 'Cappuccino',
    groups: [
      {
        id: 'size',
        label: 'Size',
        icon: '☕',
        layout: 'row',
        choices: [
          { value: 'Regular', label: 'Regular' },
          { value: 'Large', label: 'Large', priceModifier: 40 },
        ],
      },
      {
        id: 'milk',
        label: 'Milk Type',
        icon: '🥛',
        layout: 'grid-2',
        choices: [
          { value: 'Whole', label: 'Whole Milk', shortLabel: 'Whole' },
          { value: 'Oat', label: 'Oat Milk', shortLabel: 'Oat', priceModifier: 25 },
          { value: 'Almond', label: 'Almond', priceModifier: 25 },
          { value: 'Skim', label: 'Skim' },
        ],
      },
      {
        id: 'foam',
        label: 'Foam',
        icon: '☁️',
        layout: 'grid-3',
        choices: [
          { value: 'Regular', label: 'Regular' },
          { value: 'Extra', label: 'Extra Foam', shortLabel: 'Extra' },
          { value: 'Light', label: 'Light Foam', shortLabel: 'Light' },
        ],
      },
    ],
    defaults: { size: 'Regular', milk: 'Whole', foam: 'Regular' },
  },

  'espresso': {
    label: 'Espresso',
    groups: [
      {
        id: 'shots',
        label: 'Shots',
        icon: '⚡',
        layout: 'row',
        choices: [
          { value: 'Single', label: 'Single Shot', shortLabel: 'Single' },
          { value: 'Double', label: 'Double Shot', shortLabel: 'Double', priceModifier: 50 },
        ],
      },
      {
        id: 'serve',
        label: 'Serve With',
        icon: '🍪',
        layout: 'grid-2',
        choices: [
          { value: 'Plain', label: 'Plain' },
          { value: 'Biscuit', label: 'Biscuit', priceModifier: 20 },
        ],
      },
    ],
    defaults: { shots: 'Single', serve: 'Plain' },
  },

  'iced-latte': {
    label: 'Iced Latte',
    groups: [
      {
        id: 'size',
        label: 'Size',
        icon: '🧊',
        layout: 'row',
        choices: [
          { value: 'Regular', label: 'Regular' },
          { value: 'Large', label: 'Large', priceModifier: 40 },
        ],
      },
      {
        id: 'milk',
        label: 'Milk Type',
        icon: '🥛',
        layout: 'grid-2',
        choices: [
          { value: 'Whole', label: 'Whole Milk' },
          { value: 'Oat', label: 'Oat Milk', priceModifier: 25 },
          { value: 'Almond', label: 'Almond', priceModifier: 25 },
        ],
      },
      {
        id: 'sweetness',
        label: 'Sweetness',
        icon: '🍯',
        layout: 'grid-3',
        choices: [
          { value: 'None', label: 'Unsweetened', shortLabel: 'None' },
          { value: 'Light', label: 'Light' },
          { value: 'Regular', label: 'Regular' },
        ],
      },
    ],
    defaults: { size: 'Regular', milk: 'Whole', sweetness: 'Regular' },
  },

  'momo': {
    label: 'Momo',
    groups: [
      {
        id: 'portion',
        label: 'Portion',
        icon: '🥟',
        layout: 'row',
        choices: [
          { value: 'Half (5 pcs)', label: 'Half · 5 pcs', shortLabel: 'Half' },
          { value: 'Full (10 pcs)', label: 'Full · 10 pcs', shortLabel: 'Full', priceModifier: 50 },
        ],
      },
      {
        id: 'style',
        label: 'Cooking Style',
        shortLabel: 'Style',
        icon: '🔥',
        layout: 'grid-3',
        choices: [
          { value: 'Steamed', label: 'Steamed', shortLabel: 'Steam' },
          { value: 'Fried', label: 'Fried', shortLabel: 'Fried', priceModifier: 30 },
          { value: 'Jhol', label: 'Jhol Momo', shortLabel: 'Jhol', priceModifier: 40 },
        ],
      },
      {
        id: 'spice',
        label: 'Spice Level',
        shortLabel: 'Spice',
        icon: '🌶️',
        layout: 'grid-3',
        choices: [
          { value: 'Mild', label: 'Mild' },
          { value: 'Medium', label: 'Medium', shortLabel: 'Med' },
          { value: 'Spicy', label: 'Spicy' },
        ],
      },
      {
        id: 'chutney',
        label: 'Chutney',
        icon: '🥣',
        layout: 'grid-2',
        choices: [
          { value: 'Tomato Sesame', label: 'Tomato Sesame', shortLabel: 'Tomato' },
          { value: 'Spicy Chili', label: 'Spicy Chili', shortLabel: 'Spicy' },
          { value: 'Mint Curd', label: 'Mint Curd', shortLabel: 'Mint' },
          { value: 'No Chutney', label: 'No Chutney', shortLabel: 'None' },
        ],
      },
    ],
    defaults: { portion: 'Full (10 pcs)', style: 'Steamed', spice: 'Medium', chutney: 'Tomato Sesame' },
  },

  'samosa': {
    label: 'Samosa',
    groups: [
      {
        id: 'quantity',
        label: 'Quantity',
        icon: '🥟',
        layout: 'grid-3',
        choices: [
          { value: '1 pc', label: '1 pc' },
          { value: '2 pcs', label: '2 pcs', priceModifier: 80 },
          { value: '4 pcs', label: '4 pcs', priceModifier: 240 },
        ],
      },
      {
        id: 'chutney',
        label: 'Chutney',
        icon: '🥣',
        layout: 'row',
        choices: [
          { value: 'Tamarind', label: 'Tamarind' },
          { value: 'Mint', label: 'Mint' },
          { value: 'Both', label: 'Both' },
        ],
      },
    ],
    defaults: { quantity: '1 pc', chutney: 'Tamarind' },
  },

  'fries': {
    label: 'French Fries',
    groups: [
      {
        id: 'size',
        label: 'Size',
        icon: '🍟',
        layout: 'row',
        choices: [
          { value: 'Regular', label: 'Regular' },
          { value: 'Large', label: 'Large', priceModifier: 60 },
        ],
      },
      {
        id: 'seasoning',
        label: 'Seasoning',
        icon: '🧂',
        layout: 'grid-3',
        choices: [
          { value: 'Salted', label: 'Classic Salt', shortLabel: 'Salt' },
          { value: 'Peri Peri', label: 'Peri Peri', shortLabel: 'Peri', priceModifier: 20 },
          { value: 'Cheese', label: 'Cheese', priceModifier: 35 },
        ],
      },
      {
        id: 'dip',
        label: 'Dip',
        icon: '🥫',
        layout: 'grid-2',
        choices: [
          { value: 'Ketchup', label: 'Ketchup' },
          { value: 'Mayo', label: 'Mayo' },
          { value: 'Garlic Mayo', label: 'Garlic Mayo', shortLabel: 'Garlic', priceModifier: 15 },
          { value: 'Both', label: 'Ketchup + Mayo', shortLabel: 'Both' },
        ],
      },
    ],
    defaults: { size: 'Regular', seasoning: 'Salted', dip: 'Ketchup' },
  },

  'brownie': {
    label: 'Brownie',
    groups: [
      {
        id: 'serve',
        label: 'Serve',
        icon: '🍫',
        layout: 'row',
        choices: [
          { value: 'Warm', label: 'Warm' },
          { value: 'Room Temp', label: 'Room Temp', shortLabel: 'Room' },
        ],
      },
      {
        id: 'addon',
        label: 'Add-on',
        icon: '🍦',
        layout: 'grid-2',
        choices: [
          { value: 'None', label: 'Plain' },
          { value: 'Ice Cream', label: 'Vanilla Ice Cream', shortLabel: 'Ice Cream', priceModifier: 80 },
          { value: 'Whipped Cream', label: 'Whipped Cream', shortLabel: 'Cream', priceModifier: 40 },
        ],
      },
    ],
    defaults: { serve: 'Warm', addon: 'None' },
  },
}

/** Map menu item id → customization template key */
export const itemCustomizationMap = {
  1: 'milk-tea',
  2: 'milk-tea',
  3: 'black-tea',
  4: 'ginger-tea',
  5: 'honey-ginger-tea',
  6: 'mint-tea',
  7: 'cappuccino',
  8: 'momo',
  9: 'espresso',
  10: 'iced-latte',
  11: 'samosa',
  12: 'fries',
  13: 'brownie',
}

export function getCustomizationSchema(item) {
  if (!item) return null
  const templateKey = item.customizationId ?? itemCustomizationMap[item.id]
  if (!templateKey) return null
  return customizationTemplates[templateKey] ?? null
}

export function getDefaultOptions(schema) {
  if (!schema) return {}
  return { ...schema.defaults }
}

export function calculateCustomizedPrice(basePrice, options, schema) {
  if (!schema) return basePrice

  let total = basePrice
  for (const group of schema.groups) {
    const selected = options[group.id]
    const choice = group.choices.find(c => c.value === selected)
    if (choice?.priceModifier) {
      total += choice.priceModifier
    }
  }
  return total
}

/** Human-readable labels for cart / checkout */
export function formatOptionLabel(groupId, value, schema) {
  if (!schema) return value
  const group = schema.groups.find(g => g.id === groupId)
  if (!group) return value
  const choice = group.choices.find(c => c.value === value)
  return choice?.label ?? value
}

export function formatOptionsSummary(options, schema) {
  if (!options || !schema) return []
  return schema.groups
    .filter(g => options[g.id] != null)
    .map(g => ({
      key: g.id,
      label: g.label,
      value: formatOptionLabel(g.id, options[g.id], schema),
    }))
}
