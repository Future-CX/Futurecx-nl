<?php
declare(strict_types=1);

$dbPath = __DIR__ . '/trends.sqlite';

if (!file_exists($dbPath)) {
    touch($dbPath);
}

$db = new SQLite3($dbPath);
$db->enableExceptions(true);

$db->exec(
    'CREATE TABLE IF NOT EXISTS trends (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        stage TEXT NOT NULL,
        category TEXT NOT NULL,
        sources TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )'
);

function html(?string $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}

function sqlValue(SQLite3 $db, ?string $value, bool $allowNull = false): string
{
    $value = $value !== null ? trim($value) : null;

    if ($allowNull && ($value === null || $value === '')) {
        return 'NULL';
    }

    return "'" . SQLite3::escapeString((string) $value) . "'";
}

function redirectToManage(string $message): void
{
    header('Location: ?manage=1&message=' . urlencode($message), true, 303);
    exit;
}

function fetchTrends(SQLite3 $db): array
{
    $rows = [];
    $result = $db->query('SELECT * FROM trends ORDER BY id ASC');

    while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
        $rows[] = $row;
    }

    return $rows;
}

$stageOptions = [
    'Innovators',
    'Early Adopters',
    'Early Majority',
    'Late Majority',
    'Laggards',
];

$categoryOptions = [
    'Data & AI',
    'Advertising & Promotion',
    'Content & Experience',
    'CRM & Analytics',
    'Commerce & Sales',
    'Software Architecture',
];

$isManageView = isset($_GET['manage']) && $_GET['manage'] === '1';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    $name = trim((string) ($_POST['name'] ?? ''));
    $description = trim((string) ($_POST['description'] ?? ''));
    $stage = trim((string) ($_POST['stage'] ?? ''));
    $category = trim((string) ($_POST['category'] ?? ''));
    $sources = trim((string) ($_POST['sources'] ?? ''));

    if ($name === '' || $description === '' || $stage === '' || $category === '') {
        redirectToManage('Name, description, stage and category are required.');
    }

    if ($action === 'add') {
        $db->exec(
            'INSERT INTO trends (name, description, stage, category, sources) VALUES ('
            . sqlValue($db, $name) . ', '
            . sqlValue($db, $description) . ', '
            . sqlValue($db, $stage) . ', '
            . sqlValue($db, $category) . ', '
            . sqlValue($db, $sources, true)
            . ')'
        );

        redirectToManage('Trend added.');
    }

    if ($action === 'update') {
        $id = (int) ($_POST['id'] ?? 0);

        if ($id < 1) {
            redirectToManage('A valid trend id is required.');
        }

        $db->exec(
            'UPDATE trends SET '
            . 'name = ' . sqlValue($db, $name) . ', '
            . 'description = ' . sqlValue($db, $description) . ', '
            . 'stage = ' . sqlValue($db, $stage) . ', '
            . 'category = ' . sqlValue($db, $category) . ', '
            . 'sources = ' . sqlValue($db, $sources, true) . ', '
            . "updated_at = CURRENT_TIMESTAMP "
            . 'WHERE id = ' . $id
        );

        redirectToManage('Trend updated.');
    }

    redirectToManage('Unknown action.');
}

$trends = fetchTrends($db);

if (!$isManageView) {
    $jsonTrends = array_map(
        static function (array $trend): array {
            unset($trend['id']);
            return $trend;
        },
        $trends
    );

    header('Content-Type: application/json');
    echo json_encode(
        [
            'database' => $dbPath,
            'count' => count($jsonTrends),
            'trends' => $jsonTrends,
        ],
        JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES
    );
    exit;
}

$message = trim((string) ($_GET['message'] ?? ''));
?>
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Trends Manager</title>
    <link rel="stylesheet" media="screen" href="/assets/css/theme.min.css" />
  </head>
  <body class="trends-manager">
    <div class="layout">
      <section class="panel">
        <h1 class="h1 text-dark">Trends Manager</h1>
        <p class="meta">Database: <?= html($dbPath) ?> | Records: <?= count($trends) ?></p>
        <?php if ($message !== ''): ?>
          <div class="message"><?= html($message) ?></div>
        <?php endif; ?>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Stage</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              <?php foreach ($trends as $trend): ?>
                <tr>
                  <td><strong><?= html($trend['name']) ?></strong></td>
                  <td><?= html($trend['stage']) ?></td>
                  <td><?= html($trend['category']) ?></td>
                </tr>
                <tr>
                <td class="bottom-line" colspan="3">
                    Description: <?= nl2br(html($trend['description'])) ?>
                  </td>
              <?php endforeach; ?>
            </tbody>
          </table>
        </div>
      </section>

      <section class="panel">
        <h2 class="h2">Add Trend</h2>
        <form method="post">
          <input type="hidden" name="action" value="add" />
          <div class="grid-full">
            <div>
              <label>Name</label>
              <input type="text" name="name" required />
            </div>
            <div class="grid-full">
              <label>Description</label>
              <textarea name="description" required></textarea>
            </div>
            <div class="grid">
                          <div>
              <label>Stage</label>
              <select name="stage" required>
                <?php foreach ($stageOptions as $stageOption): ?>
                  <option value="<?= html($stageOption) ?>"><?= html($stageOption) ?></option>
                <?php endforeach; ?>
              </select>
            </div>
            <div>
              <label>Category</label>
              <select name="category" required>
                <?php foreach ($categoryOptions as $categoryOption): ?>
                  <option value="<?= html($categoryOption) ?>"><?= html($categoryOption) ?></option>
                <?php endforeach; ?>
              </select>
            </div>
            <div class="grid-full">
              <label>Sources</label>
              <textarea name="sources" required></textarea>
            </div>
          </div>
          <div class="actions">
            <button type="submit">Add trend</button>
          </div>
        </form>
      </section>
    </div>
  </body>
</html>
